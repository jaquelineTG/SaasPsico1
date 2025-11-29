import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { LineChart } from "react-native-chart-kit";
const screenWidth = Dimensions.get("window").width;

/* ====================== TYPE PACIENTE ====================== */
type Paciente = {
  paciente_id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  sexo: string;
  tipo_terapia: string;
  direccion: string;
  ocupacion: string;
  usuario_id: number;
  fecha_nacimiento: string;
};

type PagoDTO = {
  idPaciente: number;
  nombre: string;
  apellido: string;
  monto: number;
  fecha: string;       // LocalDate → string (formato "yyyy-MM-dd")
  metodo: string;      // enum del backend, llega como texto
};



export default function Facturacion() {

  const router = useRouter();
  const [tab, setTab] = useState("Semana");
  const [modalVisible, setModalVisible] = useState(false);

  /* === ESTADOS DE PAGO === */
  const [metodo, setMetodo] = useState<string>("");
  const [monto, setMonto] = useState<string>("");

  /* === PACIENTES === */
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  /* === FECHA === */
  const formatFechaMMDD = () => {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    const año = d.getFullYear();
    return `${mes}/${dia}/${año}`;
  };

  const [fechaPago, setFechaPago] = useState(formatFechaMMDD());

  /* === PAGOS === */
  const [pagos, setPagos] = useState([]);
  const [pagosPacientes, setPagosPacientes] = useState<PagoDTO[]>([]);
  const [ingresos30dias, setIngresos30dias] = useState<number[]>([]);
  const [porcentajeCambio, setPorcentajeCambio] = useState<number>(0);

  /* =================== CARGAR PACIENTES =================== */
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://192.168.100.12:8080/api/getPacientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setPatients(data);

      } catch (err) {
        Alert.alert('Error', 'No se pudo obtener la lista de pacientes');
      }
    };

    fetchPatients();
  }, []);

  /* =================== CARGAR PAGOS =================== */
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch("http://192.168.100.12:8080/api/getPagos", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        setPagos(data);

        procesarGrafica(data);

      } catch (err) {
        console.log("Error cargando pagos: ", err);
      }
    };

    fetchPagos();
  }, []);

    /* =================== CARGAR PAGOSPacientes =================== */
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch("http://192.168.100.12:8080/api/getPagosPacientes", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        setPagosPacientes(data);


      } catch (err) {
        console.log("Error cargando pagos: ", err);
      }
    };

    fetchPagos();
  }, []);

  /* ============= PROCESAR GRÁFICA ============= */
  const procesarGrafica = (data: PagoDTO[]) => {
  const hoy = new Date();
  const hace30 = new Date();
  hace30.setDate(hoy.getDate() - 30);

  const ingresos = Array(30).fill(0);

  data.forEach((pago: PagoDTO) => {
    const fecha = new Date(pago.fecha);
    if (fecha >= hace30 && fecha <= hoy) {
      const diff = Math.floor(
        (fecha.getTime() - hace30.getTime()) / (1000 * 60 * 60 * 24)
      );
      ingresos[diff] += pago.monto;
    }
  });

  setIngresos30dias(ingresos);

  const mitad = Math.floor(ingresos.length / 2);
  const primeros = ingresos.slice(0, mitad).reduce((a, b) => a + b, 0);
  const ultimos = ingresos.slice(mitad).reduce((a, b) => a + b, 0);
  const cambio = primeros === 0 ? 100 : ((ultimos - primeros) / primeros) * 100;

  setPorcentajeCambio(cambio);
};


  /* =================== GUARDAR PAGO =================== */
  const guardarPago = async () => {

    if (!pacienteSeleccionado) {
      Alert.alert("Error", "Debes seleccionar un paciente");
      return;
    }

    if (!monto || isNaN(parseFloat(monto))) {
      Alert.alert("Error", "Debes ingresar un monto válido");
      return;
    }

    if (!metodo) {
      Alert.alert("Error", "Selecciona un método de pago");
      return;
    }

    const convertirFechaAISO = (fecha: string) => {
      const [mes, dia, año] = fecha.split("/");
      return `${año}-${mes}-${dia}`;
    };

    const pagoDTO = {
      paciente_id: pacienteSeleccionado.paciente_id,
      monto: parseFloat(monto),
      metodo,
      fecha: convertirFechaAISO(fechaPago)
    };

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch("http://192.168.100.12:8080/api/savePago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pagoDTO),
      });

      if (res.ok) {
        Alert.alert("Éxito", "Pago registrado correctamente");
        setModalVisible(false);
        setMonto("");
        setMetodo("");
        setPacienteSeleccionado(null);
      } else {
        const error = await res.text();
        Alert.alert("Error", error);
      }

    } catch (err) {
      Alert.alert("Error", "No se pudo guardar el pago");
    }
  };

  /* ======================= UI ======================= */
  return (
    <View style={styles.container}>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["Día", "Semana", "Mes"].map((label) => (
          <TouchableOpacity
            key={label}
            onPress={() => setTab(label)}
            style={[styles.tab, tab === label && styles.tabSelected]}
          >
            <Text style={[styles.tabText, tab === label && styles.tabTextSelected]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Pagos</Text>
        <TouchableOpacity>
          <Text style={styles.headerIcon}>⇩</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>

        {/* Tarjeta Tendencia */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Tendencia de Ingresos</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {porcentajeCambio > 0 ? "+" : ""}
                {porcentajeCambio.toFixed(1)}%
              </Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Últimos 30 días</Text>

          {/* === GRÁFICA REAL === */}
          <View style={{ marginTop: 16 }}>
            <LineChart
              data={{
                labels: ["1", "5", "10", "15", "20", "25", "30"],
                datasets: [
                  {
                    data: ingresos30dias,
                    color: () => "rgba(45,108,246,1)",
                    strokeWidth: 3,
                  },
                ],
              }}
              width={screenWidth - 50}
              height={180}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: () => "rgba(45,108,246,0.6)",
                labelColor: () => "#A0A0A0",
                propsForDots: { r: "3", fill: "#2D6CF6" },
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "#E3E8FF"
                },
              }}
              withInnerLines
              bezier
              style={{ borderRadius: 16 }}
            />
          </View>
        </View>

        {/* Historial */}
        <Text style={styles.sectionTitle}>Historial de Pagos</Text>

        {pagosPacientes.slice(-10).reverse().map((p, idx) => (
          <View key={idx} style={styles.paymentCard}>
            <View>
              <Text style={styles.paymentName}>Pago de {p.nombre}{p.apellido}</Text>
              <Text style={styles.paymentSub}>{p.fecha} - {p.metodo}</Text>
            </View>
            <Text style={styles.paymentAmount}>+${p.monto}.00</Text>
          </View>
        ))}

        {/* Botón Nuevo Pago */}
        <TouchableOpacity
          style={styles.newPaymentBtn}
          onPress={() => {
            setFechaPago(formatFechaMMDD());
            setModalVisible(true);
          }}
        >
          <Text style={styles.newPaymentBtnText}>+  Nuevo Pago</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ======= MODAL ======= */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Nuevo Pago</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* SELECT PACIENTE */}
            <Text style={styles.label}>Paciente</Text>

            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setMostrarDropdown(!mostrarDropdown)}
            >
              <Text style={styles.selectBoxText}>
                {pacienteSeleccionado
                  ? pacienteSeleccionado.nombre + " " + pacienteSeleccionado.apellido
                  : "Seleccionar paciente"}
              </Text>
              <Text style={styles.arrowIcon}>⌄</Text>
            </TouchableOpacity>

            {mostrarDropdown && (
              <View style={styles.dropdownContainer}>
                {patients.map((p) => (
                  <TouchableOpacity
                    key={p.paciente_id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setPacienteSeleccionado(p);
                      setMostrarDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{p.nombre} {p.apellido}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Monto - Fecha */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Monto</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="$ 0.00"
                  style={styles.input}
                  value={monto}
                  onChangeText={setMonto}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Fecha</Text>
                <TextInput
                  value={fechaPago}
                  onChangeText={setFechaPago}
                  placeholder="mm/dd/yyyy"
                  style={styles.input}
                />
              </View>
            </View>

            {/* MÉTODO DE PAGO */}
            <Text style={styles.label}>Método de Pago</Text>

            <View style={styles.paymentMethods}>
              {["Efectivo", "Transferencia", "Tarjeta"].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodBtn, metodo === m && { backgroundColor: "#2D6CF6" }]}
                  onPress={() => setMetodo(m)}
                >
                  <Text
                    style={[styles.methodBtnText, metodo === m && { color: "white" }]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={guardarPago}
              >
                <Text style={styles.saveText}>Registrar Pago</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ============================= ESTILOS ============================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA", paddingTop: 45 },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    backgroundColor: "#E9ECF2",
    borderRadius: 14,
    marginHorizontal: 20,
  },
  tab: { paddingVertical: 6, paddingHorizontal: 22, borderRadius: 12 },
  tabSelected: { backgroundColor: "#fff" },
  tabText: { fontSize: 16, color: "#6B6B6B" },
  tabTextSelected: { color: "#2D6CF6", fontWeight: "700" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  headerIcon: { fontSize: 22 },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 16,
    borderRadius: 16,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  badge: {
    backgroundColor: "#E5F9EE",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  badgeText: { color: "#10B981", fontWeight: "700" },
  subtitle: { marginTop: 4, color: "#707070" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 10,
  },

  paymentCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentName: { fontSize: 16, fontWeight: "600" },
  paymentSub: { fontSize: 14, color: "#707070" },
  paymentAmount: { fontSize: 16, fontWeight: "700", color: "#16A34A" },

  newPaymentBtn: {
    margin: 20,
    backgroundColor: "#2D6CF6",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center"
  },
  newPaymentBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end"
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  modalTitle: { fontSize: 20, fontWeight: "700" },
  modalClose: { fontSize: 24 },

  label: { fontSize: 16, fontWeight: "600", marginBottom: 6 },

  selectBox: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  selectBoxText: {
    color: "#333",
    fontSize: 16,
  },
  arrowIcon: {
    fontSize: 18,
    color: "#777",
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    marginBottom: 12,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },

  row: { flexDirection: "row", gap: 10 },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D6D6D6",
  },

  paymentMethods: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8
  },
  methodBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#E8EFFF",
    borderRadius: 10,
    alignItems: "center"
  },
  methodBtnText: { fontWeight: "700", color: "#2D6CF6" },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 10,
    alignItems: "center"
  },
  cancelText: { fontSize: 16 },

  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#2D6CF6",
    alignItems: "center"
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" }
});
