import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

export default function TabsLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        // No hay token, redirigir al login
        router.replace("/(auth)/LoginSreen");
      } else {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  if (isLoading) return null; // o un loading spinner

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 65, paddingBottom: 8, paddingTop: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: "Citas",
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pacientes"
        options={{
          title: "Pacientes",
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="facturacion"
        options={{
          title: "Facturación",
          tabBarIcon: ({ color }) => <Ionicons name="cash-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="configuracion"
        options={{
          title: "Configuración",
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
