import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookingStore } from "../store/bookingStore.js";
import { useAuthStore } from "../store/authStore.js";
import { useNavigation } from "@react-navigation/native";

const UserBookings = () => {
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
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f4f6fa" />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>You have no bookings yet</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f6fa" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

            {/* Service Details */}
            <View style={styles.servicesContainer}>
              <Text style={styles.subHeading}>Services Included:</Text>
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

                  // Find the package - match by packageId OR by vendor category
                  let vendorPackage = null;
                  
                  // First try: Match by packageId
                  if (service.packageId) {
                    vendorPackage = booking.vendors?.find(
                      (pkg) => {
                        const pkgId = pkg._id?.toString() || pkg._id;
                        const serviceId = service.packageId?.toString() || service.packageId;
                        return pkgId === serviceId;
                      }
                    );
                  }
                  
                  // Second try: Match by vendor category if packageId didn't work
                  if (!vendorPackage) {
                    // Map serviceType to vendor category
                    const categoryMap = {
                      'venue': 'Venue',
                      'catering': 'Caterer',
                      'decoration': 'Decorator'
                    };
                    
                    const expectedCategory = categoryMap[serviceType.toLowerCase()];
                    
                    vendorPackage = booking.vendors?.find(
                      (pkg) => {
                        const vendorCategory = pkg.vendor?.category;
                        return vendorCategory === expectedCategory || vendorCategory === 'All';
                      }
                    );
                  }

                  return (
                    <View key={serviceType} style={styles.serviceBox}>
                      <Text style={styles.serviceType}>
                        {serviceType.toUpperCase()}
                      </Text>
                      
                      {/* Show Package Name */}
                      {vendorPackage ? (
                        <>
                          <Text style={styles.packageName}>
                            Package: {vendorPackage.name || "N/A"}
                          </Text>
                          
                          {/* Show Vendor Name */}
                          {vendorPackage.vendor && (
                            <Text style={styles.vendorNameInline}>
                              Provider: {vendorPackage.vendor.business_name || vendorPackage.vendor.owner_name || "Unknown"}
                            </Text>
                          )}
                        </>
                      ) : (
                        <Text style={styles.packageNotFound}>
                          Package details not available
                        </Text>
                      )}
                      
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

            <View style={styles.section}>
              <Text style={styles.subHeading}>Vendor Contacts</Text>
              <Text style={styles.note}>
                You can now talk with them and coordinate directly:
              </Text>

              {Object.entries(booking.serviceDetails || {}).map(
                ([serviceType, service]) => {
                  if (service.status !== "confirmed") return null;

                  const vendorPackage = booking.vendors?.find(
                    (pkg) =>
                      pkg._id.toString() === service.packageId?.toString()
                  );

                  if (!vendorPackage) return null;

                  return (
                    <View key={serviceType} style={styles.vendorBox}>
                      <Text style={styles.vendorType}>
                        {serviceType.toUpperCase()} PROVIDER
                      </Text>
                      <Text style={styles.vendorName}>
                        {vendorPackage.vendor?.business_name ||
                          vendorPackage.vendor?.owner_name ||
                          "Unknown Vendor"}
                      </Text>
                      {vendorPackage.vendor?.email && (
                        <Text>Email: {vendorPackage.vendor.email}</Text>
                      )}
                      {vendorPackage.vendor?.phone && (
                        <Text>Phone: {vendorPackage.vendor.phone}</Text>
                      )}
                      <Text style={styles.packageNameInVendor}>
                        Package: {vendorPackage.name}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
                      
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserBookings;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6fa",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 5 : 0,
  },
  container: {
    padding: 12,
    backgroundColor: "#f4f6fa",
  },
  backButton: {
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
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
  packageName: {
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "600",
    marginBottom: 2,
  },
  vendorNameInline: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "500",
    marginBottom: 4,
  },
  status: { marginTop: 4, fontWeight: "600" },
  vendorBox: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 8,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginBottom: 6,
    paddingHorizontal: 6,
  },
  vendorType: {
    color: "#e63946",
    fontWeight: "700",
    fontSize: 13,
  },
  vendorName: { fontWeight: "600", fontSize: 14, marginBottom: 2 },
  packageNameInVendor: {
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "500",
    marginTop: 2,
  },
  packageNotFound: {
    fontSize: 12,
    color: "#dc2626",
    fontStyle: "italic",
    marginBottom: 4,
  },
  note: { fontSize: 12, color: "#666", marginBottom: 6 },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});