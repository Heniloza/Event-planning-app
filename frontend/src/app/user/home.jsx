import { View, Text, StyleSheet } from 'react-native'
import { useAuthStore } from '../../store/authStore';

export default function home() {
  const {user} = useAuthStore();
  console.log(user,"user data in home");
  return (
    <View style={styles.container}>
      <Text>home</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#E5D9B6",
    flex:1,
    
  }
})