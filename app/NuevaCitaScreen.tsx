import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NuevaCitaScreen({ navigation }: any) {
  const [paciente, setPaciente] = useState("");
  const [pacientes, setPacientes] = useState<{ id: number; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [fechaHora, setFechaHora] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [estado, setEstado] = useState("PENDIENTE");
  const [notas, setNotas] = useState("");

  // 🔹 Cargar pacientes
  useEffect(() => {
    fetch("http://192.168.100.12:8080/api/getPacientes", {
      headers: {
        Authorization: "Bearer TU_TOKEN_AQUI", // 👈 agrega token real
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPacientes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando pacientes:", err);
        setLoading(false);
      });
  }, []);

  // 🔹 Guardar cita
  const guardarCita = async () => {
    if (!paciente) {
      Alert.alert("Error", "Debes seleccionar un paciente");
      return;
    }

    // Convertir a LocalDateTime formato ISO
    const fechaISO = fechaHora.toISOString().slice(0, 19); // "2025-10-05T15:30:00"

    const citaDTO = {
      paciente: parseInt(paciente, 10),
      fecha: fechaISO,
      estado: estado,
      notas: notas,
    };

    try {
      const res = await fetch("http://192.168.100.12:8080/api/saveCita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer TU_TOKEN_AQUI", // 👈 agrega token real
        },
        body: JSON.stringify(citaDTO),
      });

      if (res.ok) {
        Alert.alert("Éxito", "Cita guardada exitosamente");
        navigation.goBack();
      } else {
        const error = await res.text();
        Alert.alert("Error", error);
      }
    } catch (err) {
      console.error("Error guardando cita:", err);
      Alert.alert("Error", "No se pudo guardar la cita");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Cita</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* PACIENTE */}
      <Text style={styles.label}>Paciente</Text>
      <View style={styles.pickerBox}>
        {loading ? (
          <ActivityIndicator size="small" color="#4e73df" />
        ) : (
          <Picker selectedValue={paciente} onValueChange={(itemValue) => setPaciente(itemValue)}>
            <Picker.Item label="Selecciona un paciente" value="" />
            {pacientes.map((p) => (
              <Picker.Item key={p.id} label={p.nombre} value={p.id.toString()} />
            ))}
          </Picker>
        )}
      </View>

      {/* FECHA Y HORA */}
      <Text style={styles.label}>Fecha y Hora</Text>
      <TouchableOpacity style={styles.inputBox} onPress={() => setShowPicker(true)}>
        <Text>
          {fechaHora.toLocaleDateString()} {fechaHora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={fechaHora}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setFechaHora(selectedDate);
          }}
        />
      )}

      {/* ESTADO */}
      <Text style={styles.label}>Estado</Text>
      <View style={styles.pickerBox}>
        <Picker selectedValue={estado} onValueChange={(itemValue) => setEstado(itemValue)}>
          <Picker.Item label="Pendiente" value="PENDIENTE" />
          <Picker.Item label="Confirmada" value="CONFIRMADA" />
          <Picker.Item label="Cancelada" value="CANCELADA" />
          <Picker.Item label="Completada" value="COMPLETADA" />
        </Picker>
      </View>

      {/* NOTAS */}
      <Text style={styles.label}>Notas</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Escribe las notas de la cita"
        value={notas}
        onChangeText={setNotas}
        multiline
      />

      {/* BOTÓN */}
      <TouchableOpacity style={styles.boton} onPress={guardarCita}>
        <Text style={styles.botonTexto}>Guardar Cita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold" },
  label: { marginTop: 15, marginBottom: 5, fontWeight: "600", fontSize: 14 },
  pickerBox: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 10 },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  boton: {
    backgroundColor: "#bfdbfe",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  botonTexto: { color: "#111", fontWeight: "600", fontSize: 16 },
});
