import { View, Text ,StyleSheet, FlatList} from 'react-native'
import React, { useEffect } from "react";
import {useAdminStore} from "../../store/adminStore.js";
import { useAuthStore } from '../../store/authStore.js';

const vendorRequests = () => {
    const { vendorRequests, fetchVendorRequests } = useAdminStore();
    const {user} = useAuthStore();
    console.log(user,"user data in vendor request");

    useEffect(() => {
      fetchVendorRequests(user?._id);
    }, [fetchVendorRequests]);

    const renderItem = ({ item }) => (
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.acceptBtn}>
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn}>
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>vendorRequests</Text>
      <FlatList
        data={vendorRequests} 
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

export default vendorRequests

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "600" },
  email: { fontSize: 14, color: "gray", marginBottom: 10 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  acceptBtn: { backgroundColor: "green", padding: 10, borderRadius: 8 },
  rejectBtn: { backgroundColor: "red", padding: 10, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold" },
});
