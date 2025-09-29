import { View, Text ,StyleSheet,TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useVendorAuthStore } from '../../store/vendorAuthStore.js'
import UpcomingBookings from '../../components/UpcomingBookings.jsx'
import AddPackage from '../../components/AddPackage.jsx'
import { useNavigation } from 'expo-router'

export default function vendorHome() {
  const [isCreatePackage, setIsCreatePackage] = useState(false)
    const {isAuthenticated,vendor} = useVendorAuthStore();
    const navigation = useNavigation();

    useEffect(()=>{
        if(isAuthenticated && vendor.status !== 'approved'){
            navigation.navigate('vendorLogin')
          }
    },[isAuthenticated,vendor])
  return (
    <View style={styles.container}>
      <UpcomingBookings />

      {/* Quick Actions Heading */}
      <Text style={styles.heading}>Quick Actions</Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsCreatePackage(true)}
        >
          <Text style={styles.buttonTextOne}>Add Package</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("packages")}
        >
          <Text style={styles.buttonTextTwo}>My Packages</Text>
        </TouchableOpacity>
      </View>

      {isCreatePackage && (
        <AddPackage onClose={() => setIsCreatePackage(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
 secondaryButton: {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#e74c3c",
  borderRadius: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
},
  buttonTextOne: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonTextTwo: {
    color: "#e74c3c",
    fontWeight: "600",
  },
});