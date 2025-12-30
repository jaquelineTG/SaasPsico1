import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditarPerfil() {
  const router = useRouter();

  const [nombre, setNombre] = useState("Dr. Elio Villaseñor");
  const [email, setEmail] = useState("elio.villasenor@clinic.com");
  const [telefono, setTelefono] = useState(" +52 000 000 0000 ");

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Editar Perfil</Text>

      {/* Avatar */}
      <View style={styles.avatarBox}>
        <Image
         source={require("../assets/avatar.png")} 
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.changePhotoBtn}>
          <Text style={styles.changePhotoText}>Cambiar foto</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
        />
      </View>

      {/* Botón Guardar */}
      <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
        <Text style={styles.saveBtnText}>Guardar cambios</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingTop: 60,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30
  },

  avatarBox: {
    alignItems: "center",
    marginBottom: 25
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
    marginBottom: 10
  },
  changePhotoBtn: {
    paddingVertical: 4
  },
  changePhotoText: {
    color: "#2D6CF6",
    fontSize: 16,
    fontWeight: "600"
  },

  form: {
    marginTop: 10
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 18
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4
  },

  saveBtn: {
    marginTop: 40,
    backgroundColor: "#2D6CF6",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center"
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700"
  }
});
