import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useBookingStore } from "../store/bookingStore.js";
import { useAuthStore } from "../store/authStore.js";
import { useNavigation } from "@react-navigation/native";

const userBookings = () => {
  const { userBookings, fetchUserBookings } = useBookingStore();
  const { user } = useAuthStore();
  const navigation = useNavigation();

  useEffect(() => {
    if (user?._id) {
      fetchUserBookings(user._id);
    }
  }, [user?._id, fetchUserBookings]);

  if (!userBookings || userBookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You have no bookings yet</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {userBookings.map((booking, index) => (
        <View key={booking._id} style={styles.card}>
          <Text style={styles.heading}>Booking #{index + 1}</Text>
          <Text>Total Price: ₹{booking.totalPrice}</Text>
          <Text>
            Event Date:{" "}
            {booking.eventDate
              ? new Date(booking.eventDate).toLocaleDateString()
              : "N/A"}
          </Text>

          {/* Services */}
          <View style={styles.servicesContainer}>
            <Text style={styles.subHeading}>🛠 Services Included:</Text>
            {Object.entries(booking.serviceDetails || {}).map(
              ([serviceType, service]) => {
                let statusMessage = "";
                if (service.status === "pending") {
                  statusMessage = "⏳ Waiting for vendor approval";
                } else if (service.status === "confirmed") {
                  statusMessage = "✅ Confirmed";
                } else if (service.status === "cancelled") {
                  statusMessage = "❌ Try another vendor";
                }

                return (
                  <View key={serviceType} style={styles.serviceBox}>
                    <Text style={styles.serviceType}>
                      {serviceType.toUpperCase()}
                    </Text>
                    {service.guestCount && (
                      <Text>Guest Count: {service.guestCount}</Text>
                    )}
                    {service.budget && <Text>Budget: ₹{service.budget}</Text>}
                    {service.theme && <Text>Theme: {service.theme}</Text>}
                    {service.meals?.length > 0 && (
                      <Text>Meals: {service.meals.join(", ")}</Text>
                    )}
                    <Text style={styles.status}>{statusMessage}</Text>
                  </View>
                );
              }
            )}
          </View>

          {/* Vendors for confirmed services only */}
          <View style={styles.section}>
            <Text style={styles.subHeading}>📞 Vendor Contacts</Text>
            <Text style={styles.note}>
              You can now talk with them and coordinate directly:
            </Text>
            {booking.vendors
              ?.filter((pkg) =>
                Object.values(booking.serviceDetails).some(
                  (s) =>
                    s.packageId?.toString() === pkg._id.toString() &&
                    s.status === "confirmed"
                )
              )
              .map((pkg) => (
                <View key={pkg._id} style={styles.vendorBox}>
                  <Text style={styles.vendorName}>{pkg.vendor.name}</Text>
                  {pkg.vendor.email && <Text>Email: {pkg.vendor.email}</Text>}
                  {pkg.vendor.phone && <Text>Phone: {pkg.vendor.phone}</Text>}
                  <Text>Service Package: {pkg.name}</Text>
                </View>
              ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: "#f4f6fa" },
  backButton: {
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  backButtonText: { fontSize: 14, fontWeight: "600" },
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
  heading: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#333" },
  subHeading: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 5,
  },
  section: { marginTop: 10 },
  servicesContainer: { marginTop: 8 },
  serviceBox: { borderTopWidth: 1, borderTopColor: "#eee", paddingVertical: 8 },
  serviceType: { fontWeight: "600", fontSize: 14, marginBottom: 4 },
  status: { marginTop: 4, fontWeight: "600" },
  vendorBox: { borderTopWidth: 1, borderTopColor: "#eee", paddingVertical: 8 },
  vendorName: { fontWeight: "600", fontSize: 14, marginBottom: 2 },
  note: { fontSize: 12, color: "#666", marginBottom: 6 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: "#555", textAlign: "center" },
});

export default userBookings;
