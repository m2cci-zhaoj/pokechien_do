import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { login, register, resetPassword } from '../api/api';

const TABS = ['Connexion', 'Inscription', 'Mot de passe'];

const RAINBOW = ['#FF6B6B','#FF9A5C','#FFD93D','#6BCB77','#4D96FF','#C77DFF','#FF6BD6'];

const Field = ({ placeholder, value, onChange, secure = false }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#C4A882"
    value={value}
    onChangeText={onChange}
    secureTextEntry={secure}
    autoCapitalize="none"
    autoCorrect={false}
  />
);

export default function AuthScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [registerData, setRegisterData] = useState({ login: '', password: '', nom: '', prenom: '' });
  const [resetData, setResetData] = useState({ login: '', nom: '', prenom: '', newPassword: '' });

  const handleLogin = async () => {
    if (!loginData.login || !loginData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      const user = await login(loginData.login, loginData.password);
      navigation.replace('Map', { user });
    } catch (e) {
      Alert.alert('Erreur de connexion', 'Identifiants incorrects ou serveur inaccessible.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const { login: l, password, nom, prenom } = registerData;
    if (!l || !password || !nom || !prenom) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    try {
      await register(registerData);
      Alert.alert('Compte créé', 'Votre compte a été créé avec succès.', [
        { text: 'Se connecter', onPress: () => setActiveTab(0) },
      ]);
    } catch (e) {
      Alert.alert('Erreur', "Impossible de créer le compte. L'identifiant est peut-être déjà utilisé.");
    }
  };

  const handleReset = async () => {
    const { login: l, nom, prenom, newPassword } = resetData;
    if (!l || !nom || !prenom || !newPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    try {
      await resetPassword(resetData);
      Alert.alert('Succès', 'Mot de passe réinitialisé avec succès.', [
        { text: 'Se connecter', onPress: () => setActiveTab(0) },
      ]);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de réinitialiser le mot de passe. Vérifiez vos informations.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/dodo/IMG_3022.jpeg')}
      style={styles.bg}
      imageStyle={{ opacity: 0.45, top: 40, height: '125%' }}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

            {/* Title */}
            <Text style={styles.title}>
              {['P','o','k','e','c','h','i','e','n','_','d','o'].map((c, i) => (
                <Text key={i} style={{ color: RAINBOW[i % RAINBOW.length] }}>{c}</Text>
              ))}
            </Text>

            <Text style={styles.subtitle}>Trouve ta meute — Grenoble</Text>

            {/* Tabs */}
            <View style={styles.tabRow}>
              {TABS.map((tab, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.tab, activeTab === i && styles.tabActive]}
                  onPress={() => setActiveTab(i)}
                >
                  <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Card */}
            <View style={styles.card}>
              {activeTab === 0 && (
                <>
                  <Field placeholder="Identifiant" value={loginData.login}
                    onChange={(v) => setLoginData((d) => ({ ...d, login: v }))} />
                  <Field placeholder="Mot de passe" value={loginData.password}
                    onChange={(v) => setLoginData((d) => ({ ...d, password: v }))} secure />
                  <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]}
                    onPress={handleLogin} disabled={loading}>
                    <Text style={styles.btnText}>{loading ? 'Connexion…' : 'Se connecter'}</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeTab === 1 && (
                <>
                  <Field placeholder="Prénom" value={registerData.prenom}
                    onChange={(v) => setRegisterData((d) => ({ ...d, prenom: v }))} />
                  <Field placeholder="Nom" value={registerData.nom}
                    onChange={(v) => setRegisterData((d) => ({ ...d, nom: v }))} />
                  <Field placeholder="Identifiant" value={registerData.login}
                    onChange={(v) => setRegisterData((d) => ({ ...d, login: v }))} />
                  <Field placeholder="Mot de passe" value={registerData.password}
                    onChange={(v) => setRegisterData((d) => ({ ...d, password: v }))} secure />
                  <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                    <Text style={styles.btnText}>S'inscrire</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <Field placeholder="Identifiant" value={resetData.login}
                    onChange={(v) => setResetData((d) => ({ ...d, login: v }))} />
                  <Field placeholder="Prénom" value={resetData.prenom}
                    onChange={(v) => setResetData((d) => ({ ...d, prenom: v }))} />
                  <Field placeholder="Nom" value={resetData.nom}
                    onChange={(v) => setResetData((d) => ({ ...d, nom: v }))} />
                  <Field placeholder="Nouveau mot de passe" value={resetData.newPassword}
                    onChange={(v) => setResetData((d) => ({ ...d, newPassword: v }))} secure />
                  <TouchableOpacity style={styles.btn} onPress={handleReset}>
                    <Text style={styles.btnText}>Réinitialiser</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#FFF0E6' },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: 24, paddingTop: 60 },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: 'Chalkboard SE',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FFE066',
    fontWeight: '700',
    marginBottom: 32,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,235,210,0.9)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: { backgroundColor: '#FF7043' },
  tabText: { fontSize: 12, color: '#A0522D', fontWeight: '600' },
  tabTextActive: { color: '#fff', fontWeight: '700' },

  // Card
  card: {
    backgroundColor: 'rgba(255,253,248,0.96)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#FFD4B2',
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  // Input
  input: {
    borderWidth: 1.5,
    borderColor: '#FFB999',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: '#FFF8F3',
    marginBottom: 12,
    color: '#5C3317',
  },

  // Button
  btn: {
    backgroundColor: '#FF7043',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  btnDisabled: { backgroundColor: '#FFAB91' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});
