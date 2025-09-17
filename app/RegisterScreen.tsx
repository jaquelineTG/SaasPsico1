import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter(); // reemplaza navigation
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
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
            <Text style={{ color: '#333' }}>← Volver</Text>
          </TouchableOpacity>

          <Text style={styles.header}>Sign Up</Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#A8B6C2"
            />
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#A8B6C2"
            />
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#A8B6C2"
            />
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              placeholderTextColor="#A8B6C2"
            />
          </View>

          <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgree(!agree)}>
            <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
              {agree && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={{ marginLeft: 8 }}>I agree to the Terms and Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={onSignUp}>
            <Text style={styles.primaryBtnText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 24 }} onPress={() => router.push('/')}>
            <Text style={styles.signInLink}>Already have an account? Sign In</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ...styles se mantienen igual

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  container: {
    padding: 20,
    paddingTop: 10,
    flexGrow: 1
  },
  header: { textAlign: 'center', fontSize: 20, fontWeight: '700', marginBottom: 18 },

  inputWrap: {
    borderWidth: 1,
    borderColor: '#E7F0F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12
  },
  input: { fontSize: 15 },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },

  checkbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: '#C8D8E2',
    alignItems: 'center', justifyContent: 'center'
  },
  checkboxChecked: { backgroundColor: '#2FA3E0', borderColor: '#2FA3E0' },
  checkMark: { color: '#fff', fontWeight: '700' },

  primaryBtn: {
    marginTop: 18,
    backgroundColor: '#B8E0FF',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center'
  },
  primaryBtnText: { color: '#062A3A', fontWeight: '700' },

  signInLink: { color: '#6B8DA0', textAlign: 'center', textDecorationLine: 'underline' }
});
