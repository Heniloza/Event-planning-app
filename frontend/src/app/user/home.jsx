import { View, Text } from 'react-native'
import { useAuthStore } from '../../store/authStore';

export default function home() {
  const {user} = useAuthStore();
  console.log(user,"user data in home");
  return (
    <View>
      <Text>home</Text>
    </View>
  )
}