import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NuevaCitaScreen({ navigation }: any) {
  const [paciente, setPaciente] = useState('');
  const [pacientes, setPacientes] = useState<{ id: number; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    const idPsicologo = 1; // 👈 aquí pondrías el id real del psicólogo logueado
    fetch(`http://tu-servidor/api/psicologos/${idPsicologo}/pacientes`)
      .then(res => res.json())
      .then(data => {
        setPacientes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando pacientes:', err);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Cita</Text>
        <View style={{ width: 24 }} />
      </View>

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
              <Picker.Item key={p.id} label={p.nombre} value={p.id} />
            ))}
          </Picker>
        )}
      </View>

      <Text style={styles.label}>Fecha</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Seleccionar fecha"
        value={fecha}
        onChangeText={setFecha}
      />

      <Text style={styles.label}>Hora</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Seleccionar hora"
        value={hora}
        onChangeText={setHora}
      />

      <Text style={styles.label}>Motivo de la Cita</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Escribe el motivo de la cita"
        value={motivo}
        onChangeText={setMotivo}
        multiline
      />

      <TouchableOpacity style={styles.boton}>
        <Text style={styles.botonTexto}>Guardar Cita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold' },
  label: { marginTop: 15, marginBottom: 5, fontWeight: '600', fontSize: 14 },
  pickerBox: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10,
  },
  inputBox: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10,
  },
  textArea: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 12, minHeight: 80, textAlignVertical: 'top'
  },
  boton: {
    backgroundColor: '#bfdbfe',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center'
  },
  botonTexto: { color: '#111', fontWeight: '600', fontSize: 16 },
});
