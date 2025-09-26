import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Pacientes() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Usuario no autenticado');
          router.replace('/(auth)/LoginSreen');
          return;
        }

        const response = await fetch('http://192.168.100.12:8080/api/getPacientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener pacientes');
        }

        const data = await response.json();
        console.log('Pacientes:', data); // Verifica propiedades
        setPatients(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo obtener la lista de pacientes');
      }
    };

    fetchPatients();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pacientes</Text>
        <TouchableOpacity onPress={() => router.push('/AgregarPacientes')} style={styles.iconButton}>
          <Text style={styles.plus}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {patients.map((p: any) => (
          <View key={p.paciente_id} style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{p.nombre?.charAt(0)}</Text>
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.name}>{p.nombre} {p.apellido}</Text>
                <Text style={styles.subtitle}>
                  Terapia: {p.tipo_terapia}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.whatsappButton} onPress={() => {}}>
              <Text style={styles.whatsappIcon}>💬</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FBFB', marginTop: 10 },
  header: { height: 64, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0 },
  title: { fontSize: 20, fontWeight: '600' },
  iconButton: { position: 'absolute', right: 16, top: 18, padding: 8 },
  plus: { fontSize: 22, color: '#222' },
  listContainer: { paddingHorizontal: 20, paddingTop: 20, flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { 
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', 
    alignItems: 'center', justifyContent: 'center', 
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    elevation: 2 
  },
  avatarInitial: { fontSize: 20, fontWeight: '700' },
  name: { fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#6EA6B0' },
  whatsappButton: { padding: 8 },
  whatsappIcon: { fontSize: 20 },
});
