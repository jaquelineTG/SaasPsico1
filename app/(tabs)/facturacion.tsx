import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Facturacion() {
  const router = useRouter();
  const [tab, setTab] = useState("Semana");
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {["Día", "Semana", "Mes"].map((label) => (
          <TouchableOpacity
            key={label}
            onPress={() => setTab(label)}
            style={[
              styles.tab,
              tab === label && styles.tabSelected
            ]}
          >
            <Text
              style={[
                styles.tabText,
                tab === label && styles.tabTextSelected
              ]}
            >
              {label}
            </Text>
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
              <Text style={styles.badgeText}>+15%</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Últimos 30 días</Text>

          {/* Gráfica placeholder */}
          <View style={styles.graphPlaceholder}>
            <Text style={{ color: "#A0A0A0" }}>(Gráfica aquí)</Text>
          </View>
        </View>

        {/* Historial */}
        <Text style={styles.sectionTitle}>Historial de Pagos</Text>

        {[
          { paciente: "Ana Gómez", fecha: "15 Nov, 2024", tipo: "Efectivo", monto: "+$150.00" },
          { paciente: "Roberto Diaz", fecha: "12 Nov, 2024", tipo: "Transferencia", monto: "+$150.00" },
          { paciente: "Lucía Fernandez", fecha: "10 Nov, 2024", tipo: "Efectivo", monto: "+$100.00" }
        ].map((item, idx) => (
          <View key={idx} style={styles.paymentCard}>
            <View>
              <Text style={styles.paymentName}>Pago de {item.paciente}</Text>
              <Text style={styles.paymentSub}>{item.fecha} - {item.tipo}</Text>
            </View>
            <Text style={styles.paymentAmount}>{item.monto}</Text>
          </View>
        ))}

        {/* Botón Nuevo Pago */}
        <TouchableOpacity 
          style={styles.newPaymentBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.newPaymentBtnText}>+  Nuevo Pago</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Registrar Pago */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Nuevo Pago</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Contenido */}
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.label}>Paciente</Text>
              <TouchableOpacity style={styles.selectInput}>
                <Text style={styles.selectText}>Seleccionar paciente</Text>
              </TouchableOpacity>

              <View style={styles.row}>
                {/* Monto */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Monto</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="$ 0.00"
                    style={styles.input}
                  />
                </View>

                {/* Fecha */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Fecha</Text>
                  <TextInput
                    placeholder="mm/dd/yyyy"
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Método de Pago */}
              <Text style={styles.label}>Método de Pago</Text>

              <View style={styles.paymentMethods}>
                {["Efectivo", "Transf.", "Tarjeta"].map((m) => (
                  <TouchableOpacity key={m} style={styles.methodBtn}>
                    <Text style={styles.methodBtnText}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Botones */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn}>
                <Text style={styles.saveText}>Registrar Pago</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}


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

  graphPlaceholder: {
    height: 140,
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },

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
  selectInput: {
    backgroundColor: "#F2F4F7",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectText: { color: "#707070" },
  row: { flexDirection: "row", gap: 10 },

  input: {
    backgroundColor: "#F2F4F7",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12
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
