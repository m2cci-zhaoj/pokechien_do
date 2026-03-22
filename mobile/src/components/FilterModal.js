import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const fmt = (d) => {
  if (!d) return 'Non défini';
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function FilterModal({ startDate, endDate, onApply, onClose }) {
  const [start, setStart] = useState(startDate ?? null);
  const [end, setEnd] = useState(endDate ?? null);

  // Android requires explicit show/hide state; iOS shows inline
  const [showStart, setShowStart] = useState(Platform.OS === 'ios');
  const [showEnd, setShowEnd] = useState(Platform.OS === 'ios');

  const applyQuickFilter = (days) => {
    const now = new Date();
    const past = new Date();
    past.setDate(past.getDate() - days);
    setStart(past);
    setEnd(now);
  };

  const applyYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    const e = new Date(d);
    e.setHours(23, 59, 59, 0);
    setStart(d);
    setEnd(e);
  };

  const QUICK = [
    { label: 'Hier', action: applyYesterday },
    { label: '3 jours', action: () => applyQuickFilter(3) },
    { label: '7 jours', action: () => applyQuickFilter(7) },
    { label: '30 jours', action: () => applyQuickFilter(30) },
  ];

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Filtrer par date</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body}>
          {/* Quick filters */}
          <Text style={styles.sectionTitle}>Filtres rapides</Text>
          <View style={styles.quickRow}>
            {QUICK.map((q) => (
              <TouchableOpacity key={q.label} style={styles.quickBtn} onPress={q.action}>
                <Text style={styles.quickBtnText}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start date */}
          <Text style={styles.sectionTitle}>Date de début</Text>
          {Platform.OS === 'android' && (
            <TouchableOpacity style={styles.dateDisplay} onPress={() => setShowStart(true)}>
              <Text style={styles.dateDisplayText}>{fmt(start)}</Text>
            </TouchableOpacity>
          )}
          {showStart && (
            <DateTimePicker
              value={start ?? new Date()}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => {
                if (Platform.OS === 'android') setShowStart(false);
                if (date) setStart(date);
              }}
              style={styles.picker}
            />
          )}

          {/* End date */}
          <Text style={styles.sectionTitle}>Date de fin</Text>
          {Platform.OS === 'android' && (
            <TouchableOpacity style={styles.dateDisplay} onPress={() => setShowEnd(true)}>
              <Text style={styles.dateDisplayText}>{fmt(end)}</Text>
            </TouchableOpacity>
          )}
          {showEnd && (
            <DateTimePicker
              value={end ?? new Date()}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => {
                if (Platform.OS === 'android') setShowEnd(false);
                if (date) setEnd(date);
              }}
              style={styles.picker}
            />
          )}

          {/* Current selection summary */}
          {(start || end) && (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                De : {fmt(start)}{'\n'}À : {fmt(end)}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setStart(null);
              setEnd(null);
              onApply(null, null);
            }}
          >
            <Text style={styles.resetBtnText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(start, end)}>
            <Text style={styles.applyBtnText}>Appliquer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#222' },
  closeBtn: { padding: 6 },
  closeBtnText: { fontSize: 20, color: '#888' },

  body: { flex: 1, padding: 16 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },

  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#0066CC',
  },
  quickBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  dateDisplay: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fafafa',
    marginBottom: 4,
  },
  dateDisplayText: { fontSize: 14, color: '#333' },

  picker: { marginBottom: 4 },

  summary: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
  },
  summaryText: { fontSize: 13, color: '#444', lineHeight: 20 },

  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetBtn: {
    flex: 1,
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  resetBtnText: { fontSize: 15, color: '#555' },
  applyBtn: {
    flex: 1,
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#0066CC',
    alignItems: 'center',
  },
  applyBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
