// components/UpcomingBookings.jsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useVendorAuthStore } from "../store/vendorAuthStore.js";
import { usePackageStore } from "../store/packageStore.js";

export default function UpcomingBookings() {
  const { vendor } = useVendorAuthStore();
  const { packages, fetchPackage } = usePackageStore();

  useEffect(() => {
    const load = async () => {
      if (vendor?._id) {
        await fetchPackage(vendor._id);
      }
    };
    load();
  }, [vendor]);

  if (!packages.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.noBookings}>No upcoming bookings yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upcoming Bookings</Text>

      <FlatList
        data={packages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 10 }}
        renderItem={({ item }) => (
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.price}>₹{item.price}</Text>
            </View>

            <Text style={styles.detail}>
              📅 {new Date(item.eventDate).toLocaleDateString()} 🕒{" "}
              {new Date(item.eventDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            <Text style={styles.detail}>📍 {item.location || "N/A"}</Text>

            <Text style={styles.detail}>
              Services: {item.services_included?.join(", ") || "N/A"}
            </Text>

            {item.customerName && (
              <Text style={styles.detail}>👤 {item.customerName}</Text>
            )}

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  loadingText: { marginTop: 8, fontSize: 14, color: "#6b7280" },
  emptyIcon: { fontSize: 40, marginBottom: 6 },
  noBookings: { fontSize: 15, color: "#6b7280" },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: "600", color: "#111827" },
  price: { fontSize: 15, fontWeight: "bold", color: "#e74c3c" },
  detail: { fontSize: 14, color: "#374151", marginBottom: 2 },
});
