import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { createStop } from '../api/api';

const DOG_SIZES = [
  { label: 'grand', color: '#e74c3c' },
  { label: 'moyen', color: '#e67e22' },
  { label: 'petit', color: '#f1c40f' },
];

const fmtDate = (d) => d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function NewStopModal({ coordinate, user, onClose, onSaved }) {
  const [comment, setComment] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [dogFriendly, setDogFriendly] = useState(null);   // 'dog-friendly' | 'not dog-friendly' | null
  const [humainFriendly, setHumainFriendly] = useState(null); // 'humain-friendly' | 'not humain-friendly' | null
  const [photoUri, setPhotoUri] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [saving, setSaving] = useState(false);

  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [showPickerDebut, setShowPickerDebut] = useState(false);
  const [showPickerFin, setShowPickerFin] = useState(false);
  const [isPublic, setIsPublic] = useState(true);


  const pickPhoto = async (fromCamera) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission refusée', 'Autorisez l\'accès dans les réglages.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.5, allowsEditing: true, base64: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.5, allowsEditing: true, base64: true });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64);
    }
  };

  const showPhotoPicker = () => {
    Alert.alert('Ajouter une photo', 'Choisissez une source', [
      { text: 'Appareil photo', onPress: () => pickPhoto(true) },
      { text: 'Galerie', onPress: () => pickPhoto(false) },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parts = [];
      if (selectedSize) parts.push(selectedSize);
      if (dogFriendly) parts.push(dogFriendly);
      if (humainFriendly) parts.push(humainFriendly);
      if (comment.trim()) parts.push(comment.trim());
      const commentaire = parts.join('\n');
      await createStop(
        user.participantId, coordinate.longitude, coordinate.latitude, commentaire,
        dateDebut.toISOString().slice(0, 16),
        dateFin.toISOString().slice(0, 16),
        isPublic,
        photoBase64,
      );
      onSaved();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de créer l\'arrêt.');
    } finally {
      setSaving(false);
    }
  };

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
          <Text style={styles.title}>Nouvel arrêt</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* Dates côte à côte */}
          <View style={styles.dateRow}>
            <View style={styles.dateCol}>
              <Text style={styles.label}>Début</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPickerDebut(true)}>
                <Text style={styles.dateBtnText}>{fmtDate(dateDebut)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateCol}>
              <Text style={styles.label}>Fin</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPickerFin(true)}>
                <Text style={styles.dateBtnText}>{fmtDate(dateFin)}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {showPickerDebut && (
            <DateTimePicker value={dateDebut} mode="datetime" display="spinner"
              onChange={(_, d) => { setShowPickerDebut(false); if (d) setDateDebut(d); }} />
          )}
          {showPickerFin && (
            <DateTimePicker value={dateFin} mode="datetime" display="spinner"
              onChange={(_, d) => { setShowPickerFin(false); if (d) setDateFin(d); }} />
          )}

          {/* Dog size - single select */}
          <Text style={styles.label}>Taille</Text>
          <View style={styles.chipRow}>
            {DOG_SIZES.map((tag) => {
              const selected = selectedSize === tag.label;
              return (
                <TouchableOpacity
                  key={tag.label}
                  style={[styles.chip, { borderColor: tag.color }, selected && { backgroundColor: tag.color }]}
                  onPress={() => setSelectedSize(selected ? null : tag.label)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{tag.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Dog friendly - single select */}
          <Text style={styles.label}>Avec les chiens</Text>
          <View style={styles.chipRow}>
            {['Très sociable', 'Sélectif(ve)', 'Solitaire'].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.chip, { borderColor: '#27ae60' }, dogFriendly === val && { backgroundColor: '#27ae60' }]}
                onPress={() => setDogFriendly(dogFriendly === val ? null : val)}
              >
                <Text style={[styles.chipText, dogFriendly === val && styles.chipTextSelected]}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Humain friendly - single select */}
          <Text style={styles.label}>Avec les gens</Text>
          <View style={styles.chipRow}>
            {['Câlin(e)', 'Réservé(e)', 'Méfiant(e)'].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.chip, { borderColor: '#8e44ad' }, humainFriendly === val && { backgroundColor: '#8e44ad' }]}
                onPress={() => setHumainFriendly(humainFriendly === val ? null : val)}
              >
                <Text style={[styles.chipText, humainFriendly === val && styles.chipTextSelected]}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Photo + Comment côte à côte */}
          <View style={styles.photoCommentRow}>
            <TouchableOpacity style={styles.photoBtn} onPress={showPhotoPicker}>
              {photoUri
                ? <Image source={{ uri: photoUri }} style={styles.photoThumb} />
                : <Text style={styles.photoBtnText}>📷{'\n'}Photo</Text>
              }
            </TouchableOpacity>
            <TextInput
              style={styles.textarea}
              value={comment}
              onChangeText={setComment}
              placeholder="Commentaire…"
              placeholderTextColor="#aaa"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Visibility */}
          <View style={styles.switchRow}>
            <Text style={styles.label}>Visible par les autres</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#ccc', true: '#0066CC' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveBtnText}>{saving ? 'Sauvegarde…' : 'Créer l\'arrêt'}</Text>
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
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  title: { fontSize: 17, fontWeight: '700', color: '#222' },
  closeBtn: { padding: 4 },
  closeBtnText: { fontSize: 20, color: '#888' },

  body: { flex: 1, padding: 16 },

  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 14 },

  dateRow: { flexDirection: 'row', gap: 10 },
  dateCol: { flex: 1 },
  dateBtn: {
    borderWidth: 1, borderColor: '#0066CC', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#f0f6ff',
  },
  dateBtnText: { fontSize: 13, color: '#0066CC', fontWeight: '500' },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, backgroundColor: '#fff' },
  chipText: { fontSize: 12, color: '#333' },
  chipTextSelected: { color: '#fff', fontWeight: '700' },

  photoCommentRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  photoBtn: {
    width: 82, height: 82, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#0066CC', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f6ff',
  },
  photoThumb: { width: 82, height: 82, borderRadius: 12 },
  photoBtnText: { fontSize: 12, color: '#0066CC', textAlign: 'center' },
  textarea: {
    flex: 1, height: 82, borderWidth: 1, borderColor: '#e0e0e0',
    borderRadius: 10, padding: 11, fontSize: 13,
    backgroundColor: '#fafafa', color: '#222', textAlignVertical: 'top',
  },

  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 16,
  },

  footer: {
    flexDirection: 'row', padding: 14, gap: 12,
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  cancelBtn: {
    flex: 1, padding: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, color: '#555' },
  saveBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#0066CC', alignItems: 'center' },
  saveBtnText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
