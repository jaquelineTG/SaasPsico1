import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function Facturacion() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>facturacion</Text>
   
    </View>
  );
}
