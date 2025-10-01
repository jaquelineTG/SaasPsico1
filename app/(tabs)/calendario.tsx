import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface PacienteDTO {
  paciente_id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
}

export default function CitasScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [pacientes, setPacientes] = useState<PacienteDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Función para obtener citas del día
  const fetchCitasPorDia = async (fecha: string) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`http://192.168.100.12:8080/api/getCitas/${fecha}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener citas");

      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Citas</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/nueva-cita')}>
          <Ionicons name="add-circle-outline" size={28} color="#4e73df" />
        </TouchableOpacity>
      </View>

      {/* CALENDARIO */}
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          fetchCitasPorDia(day.dateString); // 🔹 Traer pacientes del día
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#4e73df',
            selectedTextColor: '#fff',
          },
        }}
        monthFormat={'MMMM yyyy'}
        theme={{
          todayTextColor: '#4e73df',
          arrowColor: '#4e73df',
          textMonthFontWeight: 'bold',
          dayTextColor: '#1f2937',
          textDayFontWeight: 'bold',
          selectedDayBackgroundColor: '#4e73df',
          selectedDayTextColor: '#fff',
          dotColor: '#4e73df',
          selectedDotColor: '#fff',
        }}
      />

      <Text style={styles.subtitle}>Proximas citas{selectedDate}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4e73df" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={pacientes} // aquí asume que el backend manda {nombre, horaInicio, horaFin, tipo}
          keyExtractor={(item) => item.paciente_id.toString()}
          renderItem={({ item, index }) => {
            // colores suaves alternados
            const colores = ['#dbeafe', '#e0e7ff', '#dcfce7'];
            const color = colores[index % colores.length];

            return (
              <View style={[styles.card, { backgroundColor: color }]}>
                <Ionicons name="calendar-outline" size={22} color="#1f2937" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.cardTitle}>{item.nombre} {item.apellido}</Text>
                  <Text style={styles.cardTime}>
                    {item.hora_inicio} - {item.hora_final} {/* puedes usar la hora de tu backend */}
                  </Text>
                </View>
                <Ionicons name="ellipsis-vertical" size={20} color="#555" />
              </View>
            );
          }}
        />

      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15, marginTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 16, fontWeight: '600', marginVertical: 15 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardTime: { fontSize: 14, color: '#555', marginTop: 2 },
});
