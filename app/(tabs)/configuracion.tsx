import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function Configuracion() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>configuracion</Text>
   
    </View>
  );
}
