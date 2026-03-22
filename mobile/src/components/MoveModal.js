import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { saveCarnetDeplacement, updateCarnetDeplacement } from '../api/api';
import { TRANSPORT_MODES } from '../constants';

const fmt = (iso) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const fmtDuration = (ms) => {
  if (!ms || ms <= 0) return 'N/A';
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m} min`;
};

// Haversine formula: returns distance in km between two [lon, lat] points
const haversine = ([lon1, lat1], [lon2, lat2]) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calcStats = (geometry, dateDebut, dateFin) => {
  const coords = geometry?.coordinates;
  if (!coords || coords.length < 2) return null;

  let distKm = 0;
  for (let i = 1; i < coords.length; i++) {
    distKm += haversine(coords[i - 1], coords[i]);
  }

  const durationMs =
    dateDebut && dateFin
      ? new Date(dateFin) - new Date(dateDebut)
      : null;

  const speedKmh =
    durationMs && durationMs > 0
      ? (distKm / (durationMs / 3600000)).toFixed(1)
      : null;

  return {
    dist: distKm >= 1 ? `${distKm.toFixed(2)} km` : `${Math.round(distKm * 1000)} m`,
    duration: fmtDuration(durationMs),
    speed: speedKmh ? `${speedKmh} km/h` : null,
  };
};

export default function MoveModal({ move, onClose, onSaved }) {
  const props = move.properties ?? {};
  const [mode, setMode] = useState(props.s_code_dep ?? '');
  const [comment, setComment] = useState(props.commentaire ?? '');
  const [saving, setSaving] = useState(false);

  const modeExists = !!(props.s_code_dep || props.s_carnet_id);
  const stats = calcStats(move.geometry, props.date_debut, props.date_fin);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { moveId: props.move_id ?? props.i_move_id, sCodeDep: mode, commentaire: comment };
      if (modeExists) {
        await updateCarnetDeplacement(payload);
      } else {
        await saveCarnetDeplacement(payload);
      }
      onSaved();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Promenade</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
          {/* Dates */}
          <View style={styles.dateRow}>
            <View style={styles.dateCell}>
              <Text style={styles.dateLabel}>Début</Text>
              <Text style={styles.dateValue}>{fmt(props.date_debut)}</Text>
            </View>
            <View style={styles.dateDivider} />
            <View style={styles.dateCell}>
              <Text style={styles.dateLabel}>Fin</Text>
              <Text style={styles.dateValue}>{fmt(props.date_fin)}</Text>
            </View>
          </View>

          {/* Stats */}
          {stats && (
            <View style={styles.statsRow}>
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{stats.dist}</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{stats.duration}</Text>
                <Text style={styles.statLabel}>Durée</Text>
              </View>
              {stats.speed && (
                <>
                  <View style={styles.statDivider} />
                  <View style={styles.statCell}>
                    <Text style={styles.statValue}>{stats.speed}</Text>
                    <Text style={styles.statLabel}>Vitesse moy.</Text>
                  </View>
                </>
              )}
            </View>
          )}

          {/* Type de promenade */}
          <Text style={styles.sectionTitle}>Type de promenade</Text>
          <View style={styles.modeGrid}>
            {TRANSPORT_MODES.map((m) => {
              const selected = mode === m.code;
              return (
                <TouchableOpacity
                  key={m.code}
                  style={[
                    styles.modeBtn,
                    { borderColor: m.color },
                    selected && { backgroundColor: m.color, borderColor: m.color },
                  ]}
                  onPress={() => setMode(selected ? '' : m.code)}
                >
                  <Text style={[styles.modeBtnText, selected && styles.modeBtnTextSelected]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Comment */}
          <Text style={styles.sectionTitle}>Commentaire</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={comment}
            onChangeText={setComment}
            placeholder="Ajouter un commentaire…"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveBtnText}>{saving ? 'Sauvegarde…' : 'Sauvegarder'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#222' },
  closeBtn: { padding: 6 },
  closeBtnText: { fontSize: 20, color: '#888' },
  body: { flex: 1, padding: 16 },

  dateRow: {
    flexDirection: 'row', backgroundColor: '#f5f7ff',
    borderRadius: 10, padding: 12, marginBottom: 12,
  },
  dateCell: { flex: 1 },
  dateDivider: { width: 1, backgroundColor: '#dde', marginHorizontal: 12 },
  dateLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  dateValue: { fontSize: 13, color: '#333', fontWeight: '500' },

  statsRow: {
    flexDirection: 'row', backgroundColor: '#fff8f0',
    borderRadius: 10, padding: 14, marginBottom: 4,
    borderWidth: 1, borderColor: '#ffe0b2',
  },
  statCell: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#ffe0b2', marginHorizontal: 8 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#e67e22' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },

  sectionTitle: {
    fontSize: 14, fontWeight: '700', color: '#333', marginTop: 16, marginBottom: 8,
  },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modeBtn: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#ddd',
  },
  modeBtnText: { fontSize: 14, color: '#333' },
  modeBtnTextSelected: { color: '#fff', fontWeight: '700' },

  input: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10,
    padding: 12, fontSize: 14, backgroundColor: '#fafafa', color: '#222',
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },

  footer: {
    flexDirection: 'row', padding: 16, gap: 12,
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  cancelBtn: {
    flex: 1, padding: 13, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, color: '#555' },
  saveBtn: {
    flex: 1, padding: 13, borderRadius: 10,
    backgroundColor: '#0066CC', alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
