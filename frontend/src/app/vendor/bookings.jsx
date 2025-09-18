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
    fetchVendorBookings(vendor?._id);
  }, [vendor]);

  const handleStatusChange = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      Toast.show({
        type: "success", // Changed from "error" to "success"
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

          {/* Event Info */}
          <Text>
            Event Date: {new Date(booking.eventDate).toLocaleDateString()}
          </Text>
          <Text>Status: {booking.status}</Text>

          {/* Vendor Specific Service Details */}
          {booking.vendorService && (
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceHeading}>Service Details</Text>
              
              {/* Guest Count - for venue and caterer */}
              {booking.vendorService.guestCount && (
                <Text>Guest Count: {booking.vendorService.guestCount}</Text>
              )}
              
              {/* Budget - for all vendor types */}
              {booking.vendorService.budget && (
                <Text>Budget: ₹{booking.vendorService.budget}</Text>
              )}
              
              {/* Theme - for decorator */}
              {booking.vendorService.theme && (
                <Text>Theme: {booking.vendorService.theme}</Text>
              )}
              
              {/* Meals - for caterer */}
              {booking.vendorService.meals &&
                booking.vendorService.meals.length > 0 && (
                  <Text>Meals: {booking.vendorService.meals.join(", ")}</Text>
                )}
            </View>
          )}

          {/* Action Buttons */}
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
  serviceDetails: {
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  serviceHeading: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#444",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2a9d8f",
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