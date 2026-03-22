import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import {
  getStops,
  getStopsMbgp,
  getMoves,
  sendGpsPoint,
  processGps,
} from '../api/api';
import {
  ACTIVITY_COLORS,
  DEFAULT_STOP_COLOR,
  MANUAL_STOP_BORDER_COLOR,
  TRAJECTORY_COLOR,
  TRANSPORT_MODES,
} from '../constants';

const MODE_COLOR_MAP = Object.fromEntries(TRANSPORT_MODES.map((m) => [m.code, m.color]));
import StopModal from '../components/StopModal';
import MoveModal from '../components/MoveModal';
import FilterModal from '../components/FilterModal';
import NewStopModal from '../components/NewStopModal';

const GRENOBLE_REGION = {
  latitude: 45.1875602,
  longitude: 5.7357819,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen({ route, navigation }) {
  const { user } = route.params;

  const [manualStops, setManualStops] = useState([]);
  const [gpsStops, setGpsStops] = useState([]);
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isTracking, setIsTracking] = useState(false);
  const [gpsCount, setGpsCount] = useState(0);

  // null = les deux désactivés = cacher tout | '__ANY__' = tous tags | valeur spécifique
  const [dogFilter, setDogFilter] = useState('__ANY__');
  const [dogDropdownOpen, setDogDropdownOpen] = useState(false);
  const [humainFilter, setHumainFilter] = useState('__ANY__');
  const [humainDropdownOpen, setHumainDropdownOpen] = useState(false);
  // 'ALL' | 'OFF' | 'PRO' | 'COU' | 'RAN' | 'BAL' | 'AUT'
  const [trajetFilter, setTrajetFilter] = useState('ALL');
  const [trajetDropdownOpen, setTrajetDropdownOpen] = useState(false);

  const [selectedStop, setSelectedStop] = useState(null); // { feature, isManual }
  const [selectedMove, setSelectedMove] = useState(null);
  const [newStopCoord, setNewStopCoord] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const locationSub = useRef(null);
  const gpsCountRef = useRef(0);

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const start = startDate ? startDate.toISOString().slice(0, 16) : null;
      const end = endDate ? endDate.toISOString().slice(0, 16) : null;

      const [stopsData, gpsData, movesData] = await Promise.all([
        getStops(user.participantId, start, end),
        getStopsMbgp(user.participantId, start, end),
        getMoves(user.participantId, start, end),
      ]);

      setManualStops(stopsData?.features ?? []);
      setGpsStops(gpsData?.features ?? []);
      setMoves(movesData?.features ?? []);
    } catch (e) {
      console.error('loadData error:', e);
    } finally {
      setLoading(false);
    }
  }, [user.participantId, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cleanup location subscription on unmount
  useEffect(() => {
    return () => {
      locationSub.current?.remove();
    };
  }, []);

  // ── GPS tracking ──────────────────────────────────────────────────────────

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        'La permission de localisation est requise pour le suivi GPS.',
      );
      return;
    }
    gpsCountRef.current = 0;
    setGpsCount(0);
    setIsTracking(true);

    locationSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      async (location) => {
        const point = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date(location.timestamp).toISOString(),
          participantId: user.participantId,
        };
        const ok = await sendGpsPoint(point);
        if (ok) {
          gpsCountRef.current += 1;
          setGpsCount(gpsCountRef.current);
        }
      },
    );
  };

  const stopTracking = async () => {
    locationSub.current?.remove();
    locationSub.current = null;
    setIsTracking(false);

    if (gpsCountRef.current > 0) {
      setLoading(true);
      try {
        await processGps(user.participantId);
        await loadData();
      } catch (e) {
        Alert.alert('Erreur', 'Impossible de traiter les données GPS.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    if (isTracking) {
      Alert.alert('GPS actif', 'Arrêtez le suivi GPS avant de vous déconnecter.');
      return;
    }
    navigation.replace('Auth');
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const getStopColor = (feature) => {
    const code = feature.properties?.s_code_act;
    return code ? (ACTIVITY_COLORS[code] ?? DEFAULT_STOP_COLOR) : DEFAULT_STOP_COLOR;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.prenom} {user.nom}
          </Text>
          {isTracking && (
            <Text style={styles.gpsCountText}>GPS: {gpsCount} pts collectés</Text>
          )}
          {(startDate || endDate) && (
            <Text style={styles.filterActiveText}>Filtre actif</Text>
          )}
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.iconBtn, filterVisible && styles.iconBtnActive]}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gpsBtn, isTracking && styles.gpsBtnStop]}
            onPress={isTracking ? stopTracking : startTracking}
          >
            <Text style={styles.gpsBtnText}>{isTracking ? '■ Stop' : '▶ GPS'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
            <Text style={styles.iconBtnText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Visibility toggles ── */}
      <View style={styles.toggleBar}>
        {/* Avec les chiens */}
        <TouchableOpacity
          style={[styles.toggle, dogFilter !== null && styles.toggleOn,
            dogFilter && dogFilter !== '__ANY__' && { backgroundColor: '#27ae60' }]}
          onPress={() => { setDogDropdownOpen((v) => !v); setHumainDropdownOpen(false); setTrajetDropdownOpen(false); }}
        >
          <Text style={[styles.toggleText, dogFilter !== null && styles.toggleTextOn]}>
            {dogFilter === null ? 'Avec chiens' :
             dogFilter === '__ANY__' ? 'Avec chiens ▾' : dogFilter + ' ▾'}
          </Text>
        </TouchableOpacity>

        {/* Avec les gens */}
        <TouchableOpacity
          style={[styles.toggle, humainFilter !== null && styles.toggleOn,
            humainFilter && humainFilter !== '__ANY__' && { backgroundColor: '#8e44ad' }]}
          onPress={() => { setHumainDropdownOpen((v) => !v); setDogDropdownOpen(false); setTrajetDropdownOpen(false); }}
        >
          <Text style={[styles.toggleText, humainFilter !== null && styles.toggleTextOn]}>
            {humainFilter === null ? 'Avec gens' :
             humainFilter === '__ANY__' ? 'Avec gens ▾' : humainFilter + ' ▾'}
          </Text>
        </TouchableOpacity>

        {/* Trajets dropdown button */}
        <TouchableOpacity
          style={[styles.toggle, trajetFilter !== 'OFF' && styles.toggleOn,
            trajetFilter !== 'OFF' && trajetFilter !== 'ALL' && {
              backgroundColor: MODE_COLOR_MAP[trajetFilter] ?? '#0066CC',
            }]}
          onPress={() => { setTrajetDropdownOpen((v) => !v); setDogDropdownOpen(false); setHumainDropdownOpen(false); }}
        >
          <Text style={[styles.toggleText, trajetFilter !== 'OFF' && styles.toggleTextOn]}>
            {trajetFilter === 'OFF' ? 'Trajets' :
             trajetFilter === 'ALL' ? 'Trajets ▾' :
             (TRANSPORT_MODES.find((m) => m.code === trajetFilter)?.label ?? 'Trajets') + ' ▾'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Dog dropdown ── */}
      {dogDropdownOpen && (
        <View style={[styles.dropdown, { left: 8 }]}>
          {[{ code: null,         label: 'Désactiver',    color: '#aaa' },
            { code: '__ANY__',    label: 'Tous',          color: '#0066CC' },
            { code: 'Très sociable', label: 'Très sociable', color: '#27ae60' },
            { code: 'Sélectif(ve)', label: 'Sélectif(ve)',  color: '#f39c12' },
            { code: 'Solitaire',  label: 'Solitaire',     color: '#e74c3c' },
          ].map((item) => (
            <TouchableOpacity
              key={String(item.code)}
              style={[styles.dropdownItem, dogFilter === item.code && { backgroundColor: item.color + '22' }]}
              onPress={() => { setDogFilter(item.code); setDogDropdownOpen(false); }}
            >
              <View style={[styles.dropdownDot, { backgroundColor: item.color }]} />
              <Text style={[styles.dropdownLabel, dogFilter === item.code && { color: item.color, fontWeight: '700' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Humain dropdown ── */}
      {humainDropdownOpen && (
        <View style={[styles.dropdown, { left: '34%' }]}>
          {[{ code: null,        label: 'Désactiver',   color: '#aaa' },
            { code: '__ANY__',   label: 'Tous',         color: '#0066CC' },
            { code: 'Câlin(e)',  label: 'Câlin(e)',     color: '#8e44ad' },
            { code: 'Réservé(e)', label: 'Réservé(e)', color: '#2980b9' },
            { code: 'Méfiant(e)', label: 'Méfiant(e)', color: '#c0392b' },
          ].map((item) => (
            <TouchableOpacity
              key={String(item.code)}
              style={[styles.dropdownItem, humainFilter === item.code && { backgroundColor: item.color + '22' }]}
              onPress={() => { setHumainFilter(item.code); setHumainDropdownOpen(false); }}
            >
              <View style={[styles.dropdownDot, { backgroundColor: item.color }]} />
              <Text style={[styles.dropdownLabel, humainFilter === item.code && { color: item.color, fontWeight: '700' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Trajet dropdown ── */}
      {trajetDropdownOpen && (
        <View style={[styles.dropdown, { right: 8 }]}>
          {[{ code: 'OFF', label: 'Masquer', color: '#aaa' },
            { code: 'ALL', label: 'Tous', color: '#0066CC' },
            ...TRANSPORT_MODES,
          ].map((item) => (
            <TouchableOpacity
              key={item.code}
              style={[styles.dropdownItem,
                trajetFilter === item.code && { backgroundColor: item.color + '22' }]}
              onPress={() => { setTrajetFilter(item.code); setTrajetDropdownOpen(false); }}
            >
              <View style={[styles.dropdownDot, { backgroundColor: item.color }]} />
              <Text style={[styles.dropdownLabel,
                trajetFilter === item.code && { color: item.color, fontWeight: '700' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Map ── */}
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={GRENOBLE_REGION}
        showsUserLocation
        showsMyLocationButton
        onPress={(e) => {
          if (e.nativeEvent.action === 'marker-press') return;
          setNewStopCoord(e.nativeEvent.coordinate);
        }}
      >
        {/* Trajectories (drawn first so they appear below markers) */}
        {trajetFilter !== 'OFF' &&
          moves.map((feature, i) => {
            const code = feature.properties?.s_code_dep;
            if (trajetFilter !== 'ALL' && code !== trajetFilter) return null;
            const coords = feature.geometry?.coordinates;
            if (!coords?.length) return null;
            const points = coords.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
            return (
              <Polyline
                key={`move-${feature.properties?.move_id ?? i}`}
                coordinates={points}
                strokeColor={MODE_COLOR_MAP[code] ?? TRAJECTORY_COLOR}
                strokeWidth={3}
                tappable
                onPress={() => { setTrajetDropdownOpen(false); setSelectedMove(feature); }}
              />
            );
          })}

        {/* GPS Stops */}
        {(dogFilter !== null || humainFilter !== null) &&
          gpsStops.map((feature, i) => {
            const coords = feature.geometry?.coordinates;
            if (!coords) return null;
            // '__ANY__' = pas de contrainte; valeur spécifique = doit correspondre; null = pas de contrainte
            if (dogFilter && dogFilter !== '__ANY__') {
              const lines = (feature.properties?.commentaire ?? '').split('\n');
              if (!lines.includes(dogFilter)) return null;
            }
            if (humainFilter && humainFilter !== '__ANY__') {
              const lines = (feature.properties?.commentaire ?? '').split('\n');
              if (!lines.includes(humainFilter)) return null;
            }
            const color = getStopColor(feature);
            return (
              <Marker
                key={`gps-${feature.properties?.i_stop_id ?? i}`}
                coordinate={{ latitude: coords[1], longitude: coords[0] }}
                onPress={() => setSelectedStop({ feature, isManual: false })}
              >
                <View
                  style={[styles.dot, { backgroundColor: color, borderColor: color }]}
                  pointerEvents="none"
                />
              </Marker>
            );
          })}

        {/* Manual Stops (drawn on top) */}
        {(dogFilter !== null || humainFilter !== null) &&
          manualStops.map((feature, i) => {
            const coords = feature.geometry?.coordinates;
            if (!coords) return null;
            if (dogFilter && dogFilter !== '__ANY__') {
              const lines = (feature.properties?.commentaire ?? '').split('\n');
              if (!lines.includes(dogFilter)) return null;
            }
            if (humainFilter && humainFilter !== '__ANY__') {
              const lines = (feature.properties?.commentaire ?? '').split('\n');
              if (!lines.includes(humainFilter)) return null;
            }
            return (
              <Marker
                key={`manual-${feature.properties?.stop_id ?? i}`}
                coordinate={{ latitude: coords[1], longitude: coords[0] }}
                onPress={() => setSelectedStop({ feature, isManual: true })}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: DEFAULT_STOP_COLOR,
                      borderColor: MANUAL_STOP_BORDER_COLOR,
                      borderWidth: 2.5,
                    },
                  ]}
                  pointerEvents="none"
                />
              </Marker>
            );
          })}
      </MapView>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      )}

      {/* Refresh FAB */}
      <TouchableOpacity style={styles.fab} onPress={loadData}>
        <Text style={styles.fabText}>↺</Text>
      </TouchableOpacity>

      {/* ── Modals ── */}
      {selectedStop && (
        <StopModal
          stop={selectedStop.feature}
          isManual={selectedStop.isManual}
          user={user}
          onClose={() => setSelectedStop(null)}
          onSaved={() => {
            setSelectedStop(null);
            loadData();
          }}
        />
      )}

      {selectedMove && (
        <MoveModal
          move={selectedMove}
          onClose={() => setSelectedMove(null)}
          onSaved={() => {
            setSelectedMove(null);
            loadData();
          }}
        />
      )}

      {newStopCoord && (
        <NewStopModal
          coordinate={newStopCoord}
          user={user}
          onClose={() => setNewStopCoord(null)}
          onSaved={() => {
            setNewStopCoord(null);
            loadData();
          }}
        />
      )}

      {filterVisible && (
        <FilterModal
          startDate={startDate}
          endDate={endDate}
          onApply={(start, end) => {
            setStartDate(start);
            setEndDate(end);
            setFilterVisible(false);
          }}
          onClose={() => setFilterVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0066CC',
  },
  headerLeft: { flex: 1, marginRight: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  gpsCountText: { color: '#a8d4ff', fontSize: 12, marginTop: 1 },
  filterActiveText: { color: '#ffe08a', fontSize: 11, marginTop: 1 },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: { backgroundColor: 'rgba(255,255,255,0.45)' },
  iconBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  gpsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#27ae60',
  },
  gpsBtnStop: { backgroundColor: '#e74c3c' },
  gpsBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // Toggle bar
  toggleBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#f0f4ff',
    gap: 6,
  },
  toggle: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#d0d8f0',
    alignItems: 'center',
  },
  toggleOn: { backgroundColor: '#0066CC' },
  toggleText: { fontSize: 11, color: '#444', fontWeight: '500' },
  toggleTextOn: { color: '#fff', fontWeight: '700' },

  // Trajet dropdown
  dropdown: {
    position: 'absolute', top: 96, right: 8, zIndex: 999,
    backgroundColor: '#fff', borderRadius: 10,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 6, paddingVertical: 4, minWidth: 160,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, gap: 10,
  },
  dropdownDot: { width: 10, height: 10, borderRadius: 5 },
  dropdownLabel: { fontSize: 14, color: '#333' },

  // Map
  map: { flex: 1 },

  // Stop marker dot
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Floating refresh button
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0066CC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 26, lineHeight: 30 },
});
