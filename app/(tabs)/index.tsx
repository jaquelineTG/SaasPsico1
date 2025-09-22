import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function DashBoardScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="black" />
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Ionicons name="notifications-outline" size={26} color="black" />
      </View>

      {/* Próximas Citas */}
      <Text style={styles.sectionTitle}>Próximas Citas</Text>
      <View style={styles.card}>
        <Ionicons name="calendar" size={20} color="#007bff" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.cardTitle}>Terapia Individual con Sofía</Text>
          <Text style={styles.cardTime}>10:00 AM - 11:00 AM</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Ionicons name="calendar" size={20} color="#007bff" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.cardTitle}>Consulta Inicial con Carlos</Text>
          <Text style={styles.cardTime}>11:30 AM - 12:30 PM</Text>
        </View>
      </View>

      {/* Próximos Pacientes */}
      <Text style={styles.sectionTitle}>Próximos Pacientes</Text>
      <View style={styles.patientCard}>
        <Ionicons name="person-circle" size={40} color="#FF7F50" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.patientName}>Laura García</Text>
          <Text style={styles.patientDate}>Próxima cita: 15 de Julio</Text>
        </View>
      </View>
      <View style={styles.patientCard}>
        <Ionicons name="person-circle" size={40} color="#6495ED" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.patientName}>Daniel Rodríguez</Text>
          <Text style={styles.patientDate}>Próxima cita: 20 de Julio</Text>
        </View>
      </View>

      {/* Métricas Rápidas */}
      <Text style={styles.sectionTitle}>Métricas Rápidas</Text>
      <View style={styles.metricsRow}>
        <View style={[styles.metricBox, { backgroundColor: "#E6F7F5" }]}>
          <Text style={styles.metricLabel}>Citas de la Semana</Text>
          <Text style={styles.metricValue}>5</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: "#FFF5E6" }]}>
          <Text style={styles.metricLabel}>Ingresos</Text>
          <Text style={styles.metricValue}>$1,200</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#E6F2FA",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardTime: {
    fontSize: 13,
    color: "#007bff",
    marginTop: 3,
  },
  patientCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  patientName: {
    fontSize: 15,
    fontWeight: "600",
  },
  patientDate: {
    fontSize: 13,
    color: "gray",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  metricBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
  },
  metricLabel: {
    fontSize: 14,
    color: "gray",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
});
