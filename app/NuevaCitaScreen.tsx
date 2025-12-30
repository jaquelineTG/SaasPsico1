import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
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

export default function NuevaCitaScreen({ navigation }: any) {
  const router = useRouter();
  const [paciente, setPaciente] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  const [fecha, setFecha] = useState<Date>(new Date());
  const [showFechaPicker, setShowFechaPicker] = useState(false);

  const [horaInicio, setHoraInicio] = useState<Date>(new Date());
  const [showHoraInicioPicker, setShowHoraInicioPicker] = useState(false);

  const [horaFinal, setHoraFinal] = useState<Date>(
    new Date(new Date().getTime() + 60 * 60 * 1000) // por defecto +1h
  );
  const [showHoraFinalPicker, setShowHoraFinalPicker] = useState(false);

  const [estado, setEstado] = useState("PENDIENTE");
  const [notas, setNotas] = useState("");

  // 🔹 Cargar pacientes
  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Usuario no autenticado");
          router.replace("/(auth)/LoginSreen");
          return;
        }

        const res = await fetch("http://192.168.100.12:8080/api/getPacientes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.text();
          console.error("Error al traer pacientes:", error);
          return;
        }

        const data = await res.json();
        setPacientes(data);
      } catch (err) {
        console.error("Error cargando pacientes:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPacientes();
  }, []);

  // 🔹 Guardar cita
  const guardarCita = async () => {
    if (!paciente) {
      Alert.alert("Error", "Debes seleccionar un paciente");
      return;
    }

    if (horaFinal <= horaInicio) {
      Alert.alert("Error", "La hora final debe ser mayor a la hora de inicio");
      return;
    }

    const fechaLocal = fecha.toLocaleDateString("en-CA");
    const horaInicioStr = horaInicio.toTimeString().slice(0, 8);
    const horaFinalStr = horaFinal.toTimeString().slice(0, 8);

    const citaDTO = {
      paciente: parseInt(paciente, 10),
      fecha: fechaLocal,
      horaInicio: horaInicioStr,
      horaFinal: horaFinalStr,
      estado: estado,
      notas: notas,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Usuario no autenticado");
        router.replace("/(auth)/LoginSreen");
        return;
      }

      const res = await fetch("http://192.168.100.12:8080/api/saveCita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(citaDTO),
      });

      if (res.ok) {
        Alert.alert("Éxito", "Cita guardada exitosamente");
        router.back(); // ✅ usa router.back() en lugar de navigation.goBack()
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
        <TouchableOpacity onPress={() => router.push("/(tabs)/calendario")}>
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
          <Picker
            selectedValue={paciente}
            onValueChange={(itemValue) => setPaciente(itemValue)}
          >
            <Picker.Item label="Selecciona un paciente" value="" />
            {pacientes.map((p) => (
              <Picker.Item
                key={p.paciente_id}
                label={`${p.nombre} ${p.apellido}`}
                value={p.paciente_id.toString()}
              />
            ))}
          </Picker>
        )}
      </View>

      {/* FECHA */}
      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setShowFechaPicker(true)}
      >
        <Text>{fecha.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showFechaPicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowFechaPicker(false);
            if (selectedDate) setFecha(selectedDate);
          }}
        />
      )}

      {/* HORA INICIO */}
      <Text style={styles.label}>Hora de inicio</Text>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setShowHoraInicioPicker(true)}
      >
        <Text>
          {horaInicio.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      {showHoraInicioPicker && (
        <DateTimePicker
          value={horaInicio}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowHoraInicioPicker(false);
            if (selectedDate) setHoraInicio(selectedDate);
          }}
        />
      )}

      {/* HORA FINAL */}
      <Text style={styles.label}>Hora final</Text>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setShowHoraFinalPicker(true)}
      >
        <Text>
          {horaFinal.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      {showHoraFinalPicker && (
        <DateTimePicker
          value={horaFinal}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowHoraFinalPicker(false);
            if (selectedDate) setHoraFinal(selectedDate);
          }}
        />
      )}

      {/* ESTADO */}
      <Text style={styles.label}>Estado</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={estado}
          onValueChange={(itemValue) => setEstado(itemValue)}
        >
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  label: { marginTop: 15, marginBottom: 5, fontWeight: "600", fontSize: 14 },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
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
