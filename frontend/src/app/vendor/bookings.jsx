import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useBookingStore } from "../../store/bookingStore.js";
import { useVendorAuthStore } from "../../store/vendorAuthStore.js";

const Bookings = () => {
  const { bookings, fetchVendorBookings, updateServiceStatus } =
    useBookingStore();
  const { vendor } = useVendorAuthStore();

  useEffect(() => {
    if (vendor?._id) {
      fetchVendorBookings(vendor._id);  
    }
  }, [vendor?._id,updateServiceStatus, fetchVendorBookings()]);

  const handleStatusChange = useCallback(
    async (bookingId, serviceType, status) => {
      try {
        console.log("Updating status...", { bookingId, serviceType, status });
        await updateServiceStatus(bookingId, serviceType, status);
      } catch (error) {
        console.error("Error updating status:", error.response?.data || error);
      }
    },
    [updateServiceStatus]
  );

  if (!bookings || bookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bookings found</Text>
        <Text style={styles.debugText}>
          Vendor ID: {vendor?._id || "No vendor"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {bookings.map((booking, index) => {
      const myServices = booking.vendorServices?.filter(
        (s) => s.belongsToVendor && s.status === "pending"
      );

        if (!myServices || myServices.length === 0) return null;

        return (
          <View key={booking._id} style={styles.card}>
            <Text style={styles.heading}>Booking #{index + 1}</Text>
            <Text>User: {booking.userId?.name || "Unknown"}</Text>
            <Text>Email: {booking.userId?.email || "N/A"}</Text>
            <Text>Phone: {booking.userId?.phone || "N/A"}</Text>
            <Text>Total Price: ₹{booking.totalPrice || "N/A"}</Text>
            <Text>Status: {booking.status}</Text>
            <Text>
              Event Date:{" "}
              {booking.eventDate
                ? new Date(booking.eventDate).toLocaleDateString()
                : "N/A"}
            </Text>
            <Text>
              Created At:{" "}
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleString()
                : "N/A"}
            </Text>

            {myServices.map((service) => (
              <View key={service.packageId} style={styles.serviceDetails}>
                <Text style={styles.serviceHeading}>
                  {service.type.toUpperCase()} (status: {service.status})
                </Text>

                {service.guestCount && (
                  <Text>Guest Count: {service.guestCount}</Text>
                )}
                {service.budget && <Text>Budget: ₹{service.budget}</Text>}
                {service.theme && <Text>Theme: {service.theme}</Text>}
                {service.meals?.length > 0 && (
                  <Text>Meals: {service.meals.join(", ")}</Text>
                )}

                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#2a9d8f" }]}
                    onPress={() =>
                      handleStatusChange(booking._id, service.type, "confirmed")
                    }
                  >
                    <Text style={styles.btnText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#e63946" }]}
                    onPress={() =>
                      handleStatusChange(booking._id, service.type, "cancelled")
                    }
                  >
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
      })}
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
    fontSize: 12,
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
    textAlign: "center",
    marginBottom: 10,
  },
  debugText: {
    fontSize: 11,
    color: "#6c757d",
  },
});

export default Bookings;
