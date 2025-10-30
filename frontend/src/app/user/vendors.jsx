import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useVendorAuthStore } from "../../store/vendorAuthStore";
import { useRouter } from "expo-router";

export default function Vendors() {
  const { allVendors, fetchAllVendors, loading } = useVendorAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAllVendors();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllVendors();
    setRefreshing(false);
  };

  const renderVendorCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: "/VendorDetails", params: { id: item._id } })}
        >
          <View style={styles.cardHeader}>
            {item.logo ? (
              <Image source={{ uri: item.logo }} style={styles.logo} />
            ) : (
              <View style={styles.placeholderLogo}>
                <Text style={styles.placeholderText}>
                  {item.business_name?.charAt(0) || "V"}
                </Text>
              </View>
            )}

            <View style={styles.headerInfo}>
              <Text style={styles.businessName} numberOfLines={1}>{item.business_name}</Text>
              <Text style={styles.ownerName} numberOfLines={1}>{item.owner_name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactSection}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Location:</Text>
              <Text style={styles.contactText} numberOfLines={2}>{item.location}</Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Phone:</Text>
              <Text style={styles.contactText} numberOfLines={1}>{item.phone}</Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.contactText} numberOfLines={1}>{item.email}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && (!allVendors || allVendors.length === 0)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading vendors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={allVendors}
        keyExtractor={(item) => item._id}
        renderItem={renderVendorCard}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366f1"]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No vendors available</Text>
            <Text style={styles.emptyStateText}>
              Please check back later for vendor listings.
            </Text>
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          (!allVendors || allVendors.length === 0) && styles.emptyListContent,
          { paddingBottom: 100 },
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5D9B6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 16, fontSize: 16, color: "#3B3B3B" },
  listContent: { paddingHorizontal: 20, paddingVertical: 16 },
  emptyListContent: { flex: 1 },
  separator: { height: 12 },
  card: {
    backgroundColor: "#fff", 
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  cardContent: { padding: 20 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  logo: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#e5e7eb" },
  placeholderLogo: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#d1d5db", justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#fff", fontSize: 24, fontWeight: "700" },
  headerInfo: { flex: 1, marginLeft: 16 },
  businessName: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 4 },
  ownerName: { fontSize: 14, fontWeight: "500", color: "#6b7280", marginBottom: 6 },
  categoryBadge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, backgroundColor: "#f0fdf4", borderRadius: 12 },
  categoryText: { fontSize: 12, fontWeight: "600", color: "#059669" },
  contactSection: { borderTopWidth: 1, borderTopColor: "#f3f4f6", paddingTop: 12 },
  contactRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  contactLabel: { width: 70, fontSize: 13, fontWeight: "500", color: "#374151", marginRight: 8 },
  contactText: { flex: 1, fontSize: 13, color: "#6b7280" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyStateTitle: { fontSize: 18, fontWeight: "500", color: "#374151", marginBottom: 6, textAlign: "center" },
  emptyStateText: { fontSize: 14, color: "#6b7280", textAlign: "center" },
});
