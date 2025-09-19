import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  const onSignUp = () => {
    if (!name || !email || !password || !confirm) {
      alert('Completa todos los campos');
      return;
    }
    if (password !== confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (!agree) {
      alert('Debes aceptar los Términos y Condiciones');
      return;
    }
    // TODO: backend
    alert('Registro OK (simulado)');
  };

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>

          <Text style={styles.appName}>PsicoApp</Text>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para empezar tu viaje.</Text>

          {/* Nombre */}
          <View style={styles.inputWrap}>
            <View style={styles.iconBox}><Text style={styles.iconText}>👤</Text></View>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#A8B6C2"
            />
          </View>
          <View style={styles.inputWrap}>
            <View style={styles.iconBox}><Text style={styles.iconText}>👤</Text></View>
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#A8B6C2"
            />
          </View>

          {/* Email */}
          <View style={styles.inputWrap}>
            <View style={styles.iconBox}><Text style={styles.iconText}>✉</Text></View>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#A8B6C2"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrap}>
            <View style={styles.iconBox}><Text style={styles.iconText}>🔒</Text></View>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#A8B6C2"
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrap}>
            <View style={styles.iconBox}><Text style={styles.iconText}>🔒</Text></View>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              placeholderTextColor="#A8B6C2"
            />
          </View>

          {/* Términos */}
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgree(!agree)}>
            <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
              {agree && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={{ marginLeft: 8 }}>Acepto los Términos y Condiciones</Text>
          </TouchableOpacity>

          {/* Botón Registro */}
          <TouchableOpacity style={styles.primaryBtn} onPress={onSignUp}>
            <Text style={styles.primaryBtnText}>Registrarse</Text>
          </TouchableOpacity>

          {/* O continuar con Google */}
          <Text style={styles.orText}>— O continúa con —</Text>

          <TouchableOpacity style={styles.googleBtn}>
            <View style={styles.googleIcon}><Text style={{ fontWeight: '700' }}>G</Text></View>
            <Text style={styles.googleText}>Registrarse con Google</Text>
          </TouchableOpacity>

          {/* Link a login */}
          <View style={styles.registerRow}>
            <Text>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/LoginSreen')}>
              <Text style={styles.registerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: {
    marginTop:30,
    padding: 24,
    paddingTop: 30,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexGrow: 1
  },
  appName: { textAlign: 'center', color: '#2FA3E0', fontSize: 20, fontWeight: '700', marginTop: 6 },
  title: { textAlign: 'center', fontSize: 26, fontWeight: '800', marginTop: 18 },
  subtitle: { textAlign: 'center', color: '#9AA8B3', marginTop: 6, marginBottom: 18 },

  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E7F0F6', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 },
  iconBox: { width: 28, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#8DA7B3' },
  input: { flex: 1, paddingHorizontal: 8 },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: '#C8D8E2', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#2FA3E0', borderColor: '#2FA3E0' },
  checkMark: { color: '#fff', fontWeight: '700' },

  primaryBtn: { marginTop: 16, backgroundColor: '#2FA3E0', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  orText: { textAlign: 'center', color: '#C9D6DD', marginVertical: 14 },
  googleBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E7F0F6', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 10 },
  googleIcon: { width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: '#E7F0F6', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  googleText: { flex: 1, textAlign: 'center' },

  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerLink: { color: '#1FB1E6', fontWeight: '700' }
});
