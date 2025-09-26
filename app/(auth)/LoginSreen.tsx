import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter(); // reemplaza navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const onLogin = async () => {
  if (!email || !password) {
    alert('Completa todos los campos');
    return;
  }

  try {
    const response = await fetch("http://192.168.100.12:8080/auth/login", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      throw new Error("Error en login");
    }

    const data = await response.json();
    console.log("Login OK:", data);

    // Guardar token (ejemplo)
    await AsyncStorage.setItem("token", data.token);

    router.replace("/(tabs)");
  } catch (error) {
    console.error(error);
    alert("Credenciales incorrectas o error de conexión");
  }
};


  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.appName}>PsicoApp</Text>

          <Text style={styles.title}>Bienvenido de nuevo</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar tu viaje.</Text>

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
              placeholder="Introduce tu contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#A8B6C2"
            />
          </View>

          <TouchableOpacity  onPress={() => router.push('/ForgotPasswordScreen')} style={{ alignSelf: 'flex-end', marginTop: 6 }} >
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onLogin}
          >
            <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>— O continúa con —</Text>

          <TouchableOpacity style={styles.googleBtn}>
            <View style={styles.googleIcon}><Text style={{ fontWeight: '700' }}>G</Text></View>
            <Text style={styles.googleText}>Iniciar sesión con Google</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/RegisterScreen')}>
              <Text style={styles.registerLink}>Regístrate ahora</Text>
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
    marginTop:50,
    padding: 24,
    paddingTop: 30,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexGrow: 1
  },
  appName: {
    textAlign: 'center',
    color: '#2FA3E0',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6
  },
  title: { textAlign: 'center', fontSize: 26, fontWeight: '800', marginTop: 18 },
  subtitle: { textAlign: 'center', color: '#9AA8B3', marginTop: 6, marginBottom: 18 },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7F0F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10
  },
  iconBox: {
    width: 28, alignItems: 'center', justifyContent: 'center'
  },
  iconText: { color: '#8DA7B3' },
  input: { flex: 1, paddingHorizontal: 8 },

  forgot: { color: '#38A0E5', fontWeight: '600' },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: '#2FA3E0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  orText: { textAlign: 'center', color: '#C9D6DD', marginVertical: 14 },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7F0F6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10
  },
  googleIcon: {
    width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: '#E7F0F6',
    alignItems: 'center', justifyContent: 'center', marginRight: 10
  },
  googleText: { flex: 1, textAlign: 'center' },

  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerLink: { color: '#1FB1E6', fontWeight: '700' }
});
