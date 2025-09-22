import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome</Text>
      <Button
        title="Go to login"
        onPress={() => router.push('/LoginSreen')}
      />
    </View>
  );
}
