import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore.js";

const VendorRequests = () => {
  const {
    vendorRequests,
    fetchVendorRequests,
    approveVendorRequest,
    rejectVendorRequest,
  } = useAdminStore();

 useEffect(() => {
   fetchVendorRequests();
 }, [vendorRequests]);

 
  const handleApprove = async (id) => {
    await approveVendorRequest(id); 
    fetchVendorRequests(); 
  };

  const handleReject = async (id) => {
    await rejectVendorRequest(id); 
    fetchVendorRequests(); 
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.name}>{item.business_name}</Text>
        <Text style={styles.subText}>Owner: {item.owner_name}</Text>
        <Text style={styles.subText}>Email: {item.email}</Text>
        <Text style={styles.subText}>Phone: {item.phone}</Text>
        <Text style={styles.subText}>Category: {item.category}</Text>
        <Text style={styles.subText}>Location: {item.location}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => handleApprove(item._id)}
        >
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => handleReject(item._id)}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Requests</Text>
      <FlatList
        data={vendorRequests}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
            No pending vendor requests.
          </Text>
        }
      />
    </View>
  );
};

export default VendorRequests;

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
