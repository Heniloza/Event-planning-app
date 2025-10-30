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
import { usePackageStore } from "../../store/packageStore";
import { useRouter } from "expo-router";

export default function Venues() {
  const { allPackages, fetchAllPackages, loading } = usePackageStore();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAllPackages();
  }, []);

  const venues =
    allPackages?.filter((pkg) => pkg.services_included?.includes("Venue")) ||
    [];

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllPackages();
    setRefreshing(false);
  };

  const trimText = (text, length = 80) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const renderVenueCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          activeOpacity={0.7}
          onPress={() =>
            router.push({ pathname: "/VenueDetails", params: { id: item._id } })
          }
        >
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.image} />
          )}

          {/* Venue Details */}
          <View style={styles.venueInfo}>
            <Text style={styles.venueName} numberOfLines={1}>
              {item.name}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{item.price}</Text>
            </View>
          </View>

          <View style={styles.vendorSection}>
            <View style={styles.vendorRow}>
              <Text style={styles.vendorLabel}>Owner:</Text>
              <Text style={styles.vendorText} numberOfLines={1}>
                {item.vendor?.owner_name || "N/A"}
              </Text>
            </View>

            <View style={styles.vendorRow}>
              <Text style={styles.vendorLabel}>Location:</Text>
              <Text style={styles.vendorText} numberOfLines={2}>
                {item.vendor?.location || "N/A"}
              </Text>
            </View>
          </View>

          {item.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.description}>
                {trimText(item.description)}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookButton}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/bookCustomizeService",
              params: { id: item._id }, 
            })
          }
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={venues}
        keyExtractor={(item) => item._id}
        renderItem={renderVenueCard}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366f1"]}
            tintColor="#6366f1"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No venues available</Text>
            <Text style={styles.emptyStateText}>
              Please check back later for venue listings.
            </Text>
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          venues.length === 0 && styles.emptyListContent,
          { paddingBottom: 100 }, 
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5D9B6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emptyListContent: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
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
  cardContent: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    marginBottom: 16,
  },
  venueInfo: {
    marginBottom: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  priceContainer: {
    alignSelf: "flex-start",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vendorSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    marginBottom: 12,
  },
  vendorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  vendorLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    width: 70,
    marginRight: 10,
  },
  vendorText: {
    flex: 1,
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  descriptionSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: "#e74c3c",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
