import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      <Button
        title="Go to Register"
        onPress={() => router.push('/LoginSreen')}
      />
    </View>
  );
}
