import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CitasScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments] = useState([
    { id: '1', date: '2024-05-05', title: 'Consulta con Sofía', time: '10:00 AM - 11:00 AM', color: '#dbeafe' },
    { id: '2', date: '2024-05-05', title: 'Terapia con Carlos', time: '11:30 AM - 12:30 PM', color: '#e0e7ff' },
    { id: '3', date: '2024-05-05', title: 'Revisión con Ana', time: '2:00 PM - 3:00 PM', color: '#dcfce7' },
  ]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Citas</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="add-circle-outline" size={28} color="#4e73df" />
        </TouchableOpacity>
      </View>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
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



      <Text style={styles.subtitle}>Próximas citas</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: item.color }]}>
            <Ionicons name="calendar-outline" size={22} color="#1f2937" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={20} color="#555" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15, marginTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 16, fontWeight: '600', marginVertical: 15 },
  selectedDate: { textAlign: 'center', marginVertical: 10, fontSize: 16, fontWeight: '600', color: '#4e73df' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardTime: { fontSize: 14, color: '#555' },
});
