import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function Configuracion() {
  const router = useRouter();

  const [push, setPush] = useState(true);
  const [emailNoti, setEmailNoti] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [theme, setTheme] = useState("claro");

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Configuración</Text>

      {/* Sección Cuenta */}
      <Text style={styles.sectionTitle}>Cuenta</Text>
      
      <View style={styles.card}>
        <Image 
          source={require("@/assets/avatar.png")} 
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Dr. Elio Villaseñor</Text>
          <Text style={styles.email}>elio.villasenor@clinic.com</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.editText}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Sección Notificaciones */}
      <Text style={styles.sectionTitle}>Notificaciones</Text>

      <View style={styles.card}>
        {/* Push */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Notificaciones Push</Text>
          <Switch value={push} onValueChange={setPush} />
        </View>

        {/* Correo */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Notificaciones por Correo</Text>
          <Switch value={emailNoti} onValueChange={setEmailNoti} />
        </View>

        {/* Recordatorios */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Recordatorios de Citas</Text>
          <Switch value={reminders} onValueChange={setReminders} />
        </View>
      </View>

      {/* Apariencia */}
      <Text style={styles.sectionTitle}>Apariencia</Text>

      <View style={styles.appearanceBox}>
        <TouchableOpacity 
          style={[styles.themeBtn, theme === "claro" && styles.themeSelected]}
          onPress={() => setTheme("claro")}
        >
          <Text style={theme === "claro" ? styles.themeTextSelected : styles.themeText}>
            Claro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.themeBtn, theme === "oscuro" && styles.themeSelected]}
          onPress={() => setTheme("oscuro")}
        >
          <Text style={theme === "oscuro" ? styles.themeTextSelected : styles.themeText}>
            Oscuro
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => {}}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 20,
    paddingTop: 60
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5
  },
  avatar: {
    width: 65,
    height: 65,
    marginRight: 15
  },
  name: {
    fontSize: 18,
    fontWeight: "700"
  },
  email: {
    fontSize: 15,
    color: "#555",
    marginTop: 3
  },
  editText: {
    color: "#2D6CF6",
    fontWeight: "600"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12
  },
  rowText: {
    fontSize: 17,
    fontWeight: "500"
  },

  appearanceBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 10,
    borderRadius: 16,
    justifyContent: "space-between",
    marginBottom: 30
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12
  },
  themeSelected: {
    backgroundColor: "#DDE7FF"
  },
  themeText: {
    fontSize: 17,
    color: "#6E6E6E"
  },
  themeTextSelected: {
    fontSize: 17,
    color: "#2D6CF6",
    fontWeight: "700"
  },

  logoutBtn: {
    backgroundColor: "#FCE3E3",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "red",
    fontSize: 18,
    fontWeight: "700"
  }
});
