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
  Image,
} from 'react-native';
import { updateStop, updateStopMbgp, deleteStop } from '../api/api';

const DOG_SIZES = ['grand', 'moyen', 'petit'];
const DOG_FRIENDLY = ['Très sociable', 'Sélectif(ve)', 'Solitaire'];
const HUMAIN_FRIENDLY = ['Câlin(e)', 'Réservé(e)', 'Méfiant(e)'];

const parseCommentaire = (raw) => {
  const lines = (raw ?? '').split('\n');
  let size = null, dogF = null, humainF = null;
  const rest = [];
  for (const line of lines) {
    if (DOG_SIZES.includes(line)) size = line;
    else if (DOG_FRIENDLY.includes(line)) dogF = line;
    else if (HUMAIN_FRIENDLY.includes(line)) humainF = line;
    else if (line.trim()) rest.push(line);
  }
  return { size, dogF, humainF, comment: rest.join('\n') };
};

const fmt = (iso) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function StopModal({ stop, isManual, user, onClose, onSaved }) {
  const props = stop.properties ?? {};
  const parsed = parseCommentaire(props.commentaire);
  const [selectedSize, setSelectedSize] = useState(parsed.size ?? null);
  const [dogF, setDogF] = useState(parsed.dogF ?? null);
  const [humainF, setHumainF] = useState(parsed.humainF ?? null);
  const [comment, setComment] = useState(parsed.comment ?? '');
  const [saving, setSaving] = useState(false);

  const handleDelete = () => {
    Alert.alert('Supprimer', `Supprimer cet arrêt (id: ${props.stop_id}) ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        const ok = await deleteStop(props.stop_id);
        if (ok) { onSaved(); }
        else { Alert.alert('Erreur', `Impossible de supprimer (stop_id: ${props.stop_id})`); }
      }},
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parts = [];
      if (selectedSize) parts.push(selectedSize);
      if (dogF) parts.push(dogF);
      if (humainF) parts.push(humainF);
      if (comment.trim()) parts.push(comment.trim());
      const commentaire = parts.join('\n');
      if (isManual) {
        await updateStop(props.stop_id, commentaire);
      } else {
        await updateStopMbgp(props.i_stop_id, commentaire);
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
          <Text style={styles.title}>{isManual ? 'Arrêt manuel' : 'Arrêt GPS'}</Text>
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

          {/* Photo */}
          {props.photo && (
            <>
              <Text style={styles.sectionTitle}>Photo</Text>
              <Image
                source={{ uri: `data:image/jpeg;base64,${props.photo}` }}
                style={styles.photo}
                resizeMode="cover"
              />
            </>
          )}

          {/* Taille */}
          <Text style={styles.sectionTitle}>Taille</Text>
          <View style={styles.chipRow}>
            {DOG_SIZES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, { borderColor: '#e67e22' }, selectedSize === s && { backgroundColor: '#e67e22' }]}
                onPress={() => setSelectedSize(selectedSize === s ? null : s)}
              >
                <Text style={[styles.chipText, selectedSize === s && styles.chipTextSelected]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Avec les chiens */}
          <Text style={styles.sectionTitle}>Avec les chiens</Text>
          <View style={styles.chipRow}>
            {DOG_FRIENDLY.map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.chip, { borderColor: '#27ae60' }, dogF === v && { backgroundColor: '#27ae60' }]}
                onPress={() => setDogF(dogF === v ? null : v)}
              >
                <Text style={[styles.chipText, dogF === v && styles.chipTextSelected]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Avec les hommes */}
          <Text style={styles.sectionTitle}>Avec les gens</Text>
          <View style={styles.chipRow}>
            {HUMAIN_FRIENDLY.map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.chip, { borderColor: '#8e44ad' }, humainF === v && { backgroundColor: '#8e44ad' }]}
                onPress={() => setHumainF(humainF === v ? null : v)}
              >
                <Text style={[styles.chipText, humainF === v && styles.chipTextSelected]}>{v}</Text>
              </TouchableOpacity>
            ))}
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
          {isManual && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteBtnText}>Supprimer</Text>
            </TouchableOpacity>
          )}
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
    borderRadius: 10, padding: 12, marginBottom: 16,
  },
  dateCell: { flex: 1 },
  dateDivider: { width: 1, backgroundColor: '#dde', marginHorizontal: 12 },
  dateLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  dateValue: { fontSize: 13, color: '#333', fontWeight: '500' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginTop: 16, marginBottom: 8 },
  photo: { width: '100%', height: 200, borderRadius: 12, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, backgroundColor: '#fff' },
  chipText: { fontSize: 12, color: '#333' },
  chipTextSelected: { color: '#fff', fontWeight: '700' },
  input: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10,
    padding: 12, fontSize: 14, backgroundColor: '#fafafa', color: '#222',
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  deleteBtn: { flex: 1, padding: 13, borderRadius: 10, backgroundColor: '#e74c3c', alignItems: 'center' },
  deleteBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
  cancelBtn: { flex: 1, padding: 13, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  cancelBtnText: { fontSize: 15, color: '#555' },
  saveBtn: { flex: 1, padding: 13, borderRadius: 10, backgroundColor: '#0066CC', alignItems: 'center' },
  saveBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
