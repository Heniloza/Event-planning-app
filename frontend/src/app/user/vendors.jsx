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
  Animated,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useVendorAuthStore } from "../../store/vendorAuthStore";

const { width } = Dimensions.get("window");

export default function Vendors() {
  const { allVendors, fetchAllVendors, loading } = useVendorAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllVendors();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllVendors();
    setRefreshing(false);
  };

  const renderVendorCard = ({ item, index }) => {
    const animatedValue = new Animated.Value(0);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    return (
      <View
        style={[
          styles.card,
        ]}
      >
        <TouchableOpacity
          style={styles.cardContent}
          activeOpacity={0.7}
          onPress={() => {
            // Handle vendor selection
            console.log("Selected vendor:", item.business_name);
          }}
        >
          {/* Header with logo and basic info */}
          <View style={styles.cardHeader}>
            <View style={styles.logoContainer}>
              {item.logo ? (
                <Image source={{ uri: item.logo }} style={styles.logo} />
              ) : (
                <View style={styles.placeholderLogo}>
                  <Text style={styles.placeholderText}>
                    {item.business_name?.charAt(0) || "V"}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.businessName} numberOfLines={1}>
                {item.business_name}
              </Text>
              <Text style={styles.ownerName} numberOfLines={1}>
                {item.owner_name}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
          </View>

          {/* Contact information */}
          <View style={styles.contactSection}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Location:</Text>
              <Text style={styles.contactText} numberOfLines={2}>
                {item.location}
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Phone:</Text>
              <Text style={styles.contactText} numberOfLines={1}>
                {item.phone}
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.contactText} numberOfLines={1}>
                {item.email}
              </Text>
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

      

      {/* Vendors List */}
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
            tintColor="#6366f1"
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
    backgroundColor: "#E5D9B6",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#3B3B3B", 
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#E5D9B6",
    borderBottomWidth: 1,
    borderBottomColor: "#C8C8A9",
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#4A4A4A",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  emptyListContent: {
    flex: 1,
  },
  separator: {
    height: 16,
  },
  card: {
    backgroundColor: "#5F8D4E", 
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#4A6A39",
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logoContainer: {
    position: "relative",
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  placeholderLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3F704D",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff", // white on green card
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  ownerName: {
    fontSize: 15,
    color: "#E8F5E9", // lighter green tint
    marginBottom: 10,
    fontWeight: "500",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#E5D9B6", // matches main bg
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C8C8A9",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C2C2C", // dark gray for readability
    textTransform: "capitalize",
  },
  contactSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#4A6A39", // darker border inside green card
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F1F8F5", // almost white
    width: 80,
    marginRight: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 14,
    color: "#E0EDE7", // softer light greenish white
    lineHeight: 20,
    fontWeight: "400",
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
    color: "#2C2C2C",
    marginBottom: 6,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#4A4A4A",
    textAlign: "center",
    lineHeight: 20,
  },
});

