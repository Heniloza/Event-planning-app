import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { usePackageStore } from "../store/packageStore";

export default function VenueDetails() {
  const { id } = useLocalSearchParams(); // Get the id from URL
  const { allPackages, fetchAllPackages } = usePackageStore();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenue = async () => {
      setLoading(true);
      try {
        // Fetch all packages to ensure store is up-to-date
        await fetchAllPackages();
        const found = allPackages.find((pkg) => pkg._id === id);
        setVenue(found || null);
      } catch (err) {
        console.error("Error loading venue:", err);
      } finally {
        setLoading(false);
      }
    };
    loadVenue();
  }, [id, allPackages]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text>Loading venue...</Text>
      </View>
    );
  }

  if (!venue) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Venue Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {venue.image && (
        <Image source={{ uri: venue.image }} style={styles.image} />
      )}
      <Text style={styles.title}>{venue.name}</Text>
      <Text style={styles.price}>₹{venue.price}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>{venue.vendor?.owner_name || "N/A"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{venue.vendor?.location || "N/A"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>
          {venue.description || "No description"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: { width: "100%", height: 220, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 16,
  },
  section: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  value: { fontSize: 14, color: "#6b7280", marginTop: 2 },
});
