import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AgregarPacientes() {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [dob, setDob] = useState<Date>(new Date());
  const [showDobPicker, setShowDobPicker] = useState<boolean>(false);
  const [occupation, setOccupation] = useState<string>('');
  const [tipoTerapia, setTipoTerapia] = useState<string>('INDIVIDUAL');
  const [phone, setPhone] = useState<string>('');
  const [sex, setSex] = useState<string>('FEMENINO');
  const [address, setAddress] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');

  const handleSave = async () => {
    if (!firstName || !lastName || !phone || !sex || !emergencyContact) {
      Alert.alert('Campos incompletos', 'Por favor, completa los campos obligatorios.');
      return;
    }

    // Recuperar token guardado
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    const newPatient = {
      nombre: firstName,
      apellido: lastName,
      fecha_nacimiento: dob.toISOString().split('T')[0], // "YYYY-MM-DD"
      ocupacion: occupation,
      tipo_terapia: tipoTerapia, // coincide con enum Java
      telefono: phone,
      sexo: sex,
      direccion: address,
      numero_emergencia: emergencyContact.trim(),
    };

    try {
      const response = await fetch('http://192.168.100.12:8080/api/savePaciente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPatient),
      });

      if (!response.ok) throw new Error('Error al guardar paciente');

      const msg = await response.text();
      Alert.alert('Éxito', msg);
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar el paciente');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Image
            source={require('./images/flechaRegresar.png')}
            resizeMode="contain"
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Agregar Paciente</Text>
      </View>

      <ScrollView contentContainerStyle={{ ...styles.formContainer, flexGrow: 1 }}>
        <View style={styles.fieldRow}>
          <TextInput placeholder="Nombre" value={firstName} onChangeText={setFirstName} style={styles.input} />
          <TextInput placeholder="Apellido" value={lastName} onChangeText={setLastName} style={styles.input} />
        </View>

        <View style={styles.fieldColumn}>
          <Text style={styles.label}>Fecha de nacimiento</Text>
          <TouchableOpacity onPress={() => setShowDobPicker(true)} style={styles.dateBox}>
            <Text>{dob.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDobPicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, selected) => {
                setShowDobPicker(false);
                if (selected) setDob(selected);
              }}
            />
          )}
        </View>

        <TextInput placeholder="Ocupación" value={occupation} onChangeText={setOccupation} style={styles.inputSingle} />

        <View style={styles.fieldColumn}>
          <Text style={styles.label}>Tipo de Terapia</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={tipoTerapia} onValueChange={setTipoTerapia}>
              <Picker.Item label="Terapia individual" value="INDIVIDUAL" />
              <Picker.Item label="Terapia de pareja" value="PAREJA" />
              <Picker.Item label="Terapia familiar" value="FAMILIAR" />
              <Picker.Item label="Terapia en grupo" value="GRUPAL" />
              <Picker.Item label="Terapia infantil" value="INFANTIL" />
              <Picker.Item label="Terapia especializada" value="ESPECIALIZADA" />
            </Picker>
          </View>
        </View>

        <TextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.inputSingle} />

        <View style={styles.fieldColumn}>
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={sex} onValueChange={setSex}>
              <Picker.Item label="femenino" value="FEMENINO" />
              <Picker.Item label="masculino" value="MASCULINO" />
              <Picker.Item label="otro" value="OTRO" />
            </Picker>
          </View>
        </View>

        <TextInput placeholder="Dirección" value={address} onChangeText={setAddress} style={styles.inputSingle} />
        <TextInput placeholder="Contacto de emergencia" value={emergencyContact} keyboardType="phone-pad" onChangeText={setEmergencyContact} style={styles.inputSingle} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Paciente</Text>
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FBFB', marginTop: 10 },
  header: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginStart: 12 },
  iconButton: { padding: 8 },
  formContainer: { paddingHorizontal: 20, paddingTop: 20 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fieldColumn: { marginBottom: 12 },
  label: { marginBottom: 6, color: '#707070' },
  dateBox: { padding: 12, backgroundColor: '#fff', borderRadius: 10 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, width: '48%' },
  inputSingle: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12 },
  pickerBox: { backgroundColor: '#fff', borderRadius: 10 },
  saveButton: { backgroundColor: '#176F9B', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#fff', fontWeight: '600' },
});
