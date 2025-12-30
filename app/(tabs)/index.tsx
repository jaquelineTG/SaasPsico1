import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DashBoardScreen() {
  const router = useRouter();
  const [PacientesyHorario, setPacientesyHorario] = useState<any[]>([]);
  const [PacientesProximos, setPacientesProximos] = useState<any[]>([]);
  const [Pacientes, setPacientes] = useState<any[]>([]);
  const [noCitasSemanal, setNoCitasSemanal] = useState(0);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Usuario no autenticado');
          router.replace('/(auth)/LoginSreen');
          return;
        }

        const response = await fetch('http://192.168.100.12:8080/api/getPacientesPorFecha', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener pacientes Y horario');
        }

        const data = await response.json();
        console.log('Pacientes:', data); // Verifica propiedades
        setPacientesyHorario(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo obtener la lista de pacientes');
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchPacientesProximasFechas = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Usuario no autenticado');
          router.replace('/(auth)/LoginSreen');
          return;
        }

        const response = await fetch('http://192.168.100.12:8080/api/getPacientesPorProximasFechas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener pacientes de fechas proximas');
        }

        const data = await response.json();
        console.log('Pacientes:', data); // Verifica propiedades
        setPacientesProximos(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo obtener la lista de pacientes proximos');
      }
    };

    fetchPacientesProximasFechas();
  }, []);

  useEffect(() => {
    const fetchNoCitasSemanal = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Usuario no autenticado');
          router.replace('/(auth)/LoginSreen');
          return;
        }

        const response = await fetch('http://192.168.100.12:8080/api/getCitasPorSemana', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener pacientes de fechas proximas');
        }

        const data = await response.json();
        console.log('Pacientes:', data); // Verifica propiedades
        setNoCitasSemanal(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo obtener la lista de pacientes proximos');
      }
    };

    fetchNoCitasSemanal();
  }, []);

  // Formatea "2025-11-13" a "13 de noviembre"
  const formatearFecha = (fechaString: string) => {
    try {
      const fecha = DateTime.fromISO(fechaString);
      return fecha.setLocale('es').toFormat("d 'de' LLLL");
    } catch {
      return fechaString;
    }
  };

  // Formatea "16:39:51" a "4:39 pm"
  const formatearHora = (horaString: string) => {
    try {
      // Si viene como "16:39:51" → la convertimos a 16:39
      const hora = DateTime.fromFormat(horaString.substring(0, 5), "HH:mm");
      return hora.toFormat("h:mm a").toLowerCase(); // "4:39 pm"
    } catch {
      return horaString;
    }
  };

    useEffect(() => {
    const getPatients = async () => {
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
          throw new Error('Error al obtener pacientes de fechas proximas');
        }

        const data = await response.json();
        console.log('Pacientes:', data); 
        setPacientes(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo obtener la lista de pacientes proximos');
      }
    };

    getPatients();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <Ionicons name="notifications-outline" size={26} color="black" />
      </View>


      {/* Próximas Citas */}
      <Text style={styles.sectionTitle}>Próximas Citas del Dia</Text>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {PacientesyHorario.map((p: any) => (
          <View key={p.id} style={styles.card}>
            <Ionicons name="calendar" size={20} color="#007bff" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.cardTitle}>Consulta {p.tipo_terapia} con {p.nombre}</Text>
              <Text style={styles.cardTime}>
                {formatearHora(p.hora_inicio)} - {formatearHora(p.hora_final)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View>

      </View>

      {/* Próximos Pacientes */}
      <Text style={styles.sectionTitle}>Próximos Pacientes</Text>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {PacientesProximos.map((p: any) => (
          <View style={styles.patientCard}>
            <Ionicons name="person-circle" size={40} color="#FF7F50" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.patientName}>{p.nombre} {p.apellido}</Text>
              <Text style={styles.patientDate}>
                Próxima cita: {formatearFecha(p.fecha)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Métricas Rápidas */}
      <Text style={styles.sectionTitle}>Métricas Rápidas</Text>
      <View style={styles.metricsRow}>
        <View style={[styles.metricBox, { backgroundColor: "#E6F7F5" }]}>
          <Text style={styles.metricLabel}>Citas de la Semana</Text>
          <Text style={styles.metricValue}>{noCitasSemanal}</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: "#FFF5E6" }]}>
          <Text style={styles.metricLabel}>Ingresos</Text>
          <Text style={styles.metricValue}>$1,200</Text>
        </View>
      </View>
      <View style={[styles.metricBox, { backgroundColor: "#e3d8fcff" }]}>
        <Text style={styles.metricLabel}>Pacientes Activos</Text>
        <Text style={styles.metricValue}>{Pacientes.length}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginTop: 10
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexGrow: 1
  }
});
