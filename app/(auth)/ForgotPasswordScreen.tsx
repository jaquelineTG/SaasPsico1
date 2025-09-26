import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >

        {/* Header con flecha */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require('./images/flechaRegresar.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Recuperar Contraseña</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
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

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => { /* TODO: backend auth */ }}
          >
            <Text style={styles.primaryBtnText}>Enviar Enlace</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: { padding: 24, paddingTop: 30, flexGrow: 1 },

  headerRow: {
    marginTop:30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  backIcon: { width: 24, height: 24, marginRight: 10 },
  headerText: { fontSize: 20, fontWeight: '700', color: '#000' },

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
  iconBox: { width: 28, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#8DA7B3' },
  input: { flex: 1, paddingHorizontal: 8 },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: '#2FA3E0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});
