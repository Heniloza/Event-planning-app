import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useBookingStore } from "../../store/bookingStore.js";
import {useVendorAuthStore} from "../../store/vendorAuthStore.js"
import Toast from "react-native-toast-message";

const Bookings = () => {
  const { bookings, fetchVendorBookings, updateBookingStatus } =
    useBookingStore();
  const { vendor } = useVendorAuthStore(); 

  useEffect(() => {
      fetchVendorBookings(vendor._id);
  }, [vendor]);

  const handleStatusChange = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
     Toast.show({
       type: "error",
       text1: `Booking ${status} successfully`,
     });
    } catch (err) {
      Toast.show({
        type:"error",
        text1:"Failed to update booking status"
      })
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bookings yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {bookings.map((booking) => (
        <View key={booking._id} style={styles.card}>
          <Text style={styles.heading}>Booking Details</Text>
          <Text>User: {booking.userId?.name || "Unknown"}</Text>
          <Text>Email: {booking.userId?.email || "N/A"}</Text>
          <Text>Phone: {booking.userId?.phone || "N/A"}</Text>
          <Text>Guests: {booking.guests}</Text>
          <Text>Date: {new Date(booking.eventDate).toLocaleDateString()}</Text>
          <Text>Total Price: ₹{booking.totalPrice}</Text>
          <Text>Status: {booking.status}</Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#2a9d8f" }]}
              onPress={() => handleStatusChange(booking._id, "confirmed")}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#e63946" }]}
              onPress={() => handleStatusChange(booking._id, "cancelled")}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f4f6fa",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
  },
});

export default Bookings;
