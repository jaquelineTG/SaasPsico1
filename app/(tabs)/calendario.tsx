import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function CitasScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [citas, setCitas] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchCitasPorDia = async (fecha: string) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`http://192.168.100.12:8080/api/getCitas/${fecha}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener citas");
      const data = await res.json();
      setCitas(data);
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
        <Text style={styles.title}>Citas</Text>
        <TouchableOpacity onPress={() => router.push("/NuevaCitaScreen")}>
          <Ionicons name="add-circle-outline" size={32} color="#4e73df" />
        </TouchableOpacity>
      </View>

      {/* CALENDARIO */}
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          fetchCitasPorDia(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#4e73df",
            selectedTextColor: "#fff",
          },
        }}
        monthFormat={"MMMM yyyy"}
        theme={{
          todayTextColor: "#4e73df",
          arrowColor: "#4e73df",
          textMonthFontWeight: "bold",
          textDayFontWeight: "bold",
          textMonthFontSize: 18,
          selectedDayBackgroundColor: "#4e73df",
          selectedDayTextColor: "#fff",
          dotColor: "#4e73df",
          selectedDotColor: "#fff",
        }}
      />

      {/* SUBTÍTULO */}
      <Text style={styles.subtitle}>Próximas citas</Text>

      {/* LISTA DE CITAS */}
      {loading ? (
        <ActivityIndicator size="large" color="#4e73df" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.paciente_id.toString()}
          renderItem={({ item, index }) => {
            const colores = ["#e0e7ff", "#dbeafe", "#dcfce7"];
            const color = colores[index % colores.length];
            return (
              <View style={[styles.card, { backgroundColor: color }]}>
                <Ionicons name="calendar-outline" size={22} color="#1f2937" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>
                    {item.nombre} {item.apellido}
                  </Text>
                  <Text style={styles.cardTime}>
                    {item.hora_inicio} - {item.hora_final}
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
  container: { flex: 1, backgroundColor: "#fff", padding: 15, marginTop: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 15,
    color: "#111827",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  cardTime: { fontSize: 14, color: "#4b5563", marginTop: 2 },
});
