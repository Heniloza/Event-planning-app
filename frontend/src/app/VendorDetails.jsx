import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useVendorAuthStore } from "../store/vendorAuthStore";

export default function VendorDetails() {
  const { id } = useLocalSearchParams();
  const { allVendors, fetchAllVendors } = useVendorAuthStore();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const loadVendor = async () => {
      try {
        if (!allVendors || allVendors.length === 0) {
          await fetchAllVendors();
        }
        const found = allVendors?.find((v) => v._id === id)
        console.log(found);
        ;
        setVendor(found || null);
      } catch (err) {
        console.error("Error fetching vendor:", err);
      }
    };
    loadVendor();
  }, [id, allVendors]);

  if (!vendor) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading vendor...</Text>
      </View>
    );
  }

  if (!vendor) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Vendor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
        {vendor.logo ? (
          <Image source={{ uri: vendor.logo }} style={styles.logo} />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>
              {vendor.business_name?.charAt(0) || "V"}
            </Text>
          </View>
        )}

        {/* Business Info */}
        <Text style={styles.businessName}>{vendor.business_name}</Text>
        <Text style={styles.ownerName}>
          Owner: {vendor.owner_name || "N/A"}
        </Text>
        <Text style={styles.category}>
          Category: {vendor.category || "N/A"}
        </Text>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{vendor.location || "N/A"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{vendor.phone || "N/A"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{vendor.email || "N/A"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>
            {vendor.description || "No description available"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#E5D9B6" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#6366f1" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#6b7280" },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    alignSelf: "center",
  },
  placeholderLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
  },
  placeholderText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  businessName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: "500",
    color: "#059669",
    textAlign: "center",
    marginBottom: 12,
  },
  section: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 2 },
  value: { fontSize: 14, color: "#6b7280" },
});
