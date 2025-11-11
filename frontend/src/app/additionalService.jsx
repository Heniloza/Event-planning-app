import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePackageStore } from "../store/packageStore";
import Toast from "react-native-toast-message";

const AdditionalService = () => {
  const { allPackages, fetchAllPackages } = usePackageStore();
  const [decoratorPackages, setDecoratorPackages] = useState([]);
  const [catererPackages, setCatererPackages] = useState([]);
  const [selectedDecorator, setSelectedDecorator] = useState(null);
  const [selectedCaterer, setSelectedCaterer] = useState(null);
  const [existingPackages, setExistingPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { selectedServices: existingServices } = useLocalSearchParams();

  useEffect(() => {
    if (existingServices) {
      try {
        const parsed = JSON.parse(existingServices);
        const existing = Array.isArray(parsed) ? parsed : [parsed];
        setExistingPackages(existing);
      } catch (e) {
        console.error("Error parsing existing services:", e);
      }
    }
  }, [existingServices]);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        await fetchAllPackages();
      } catch (err) {
        console.error("Error fetching packages:", err);
        Toast.show({
          type: "error",
          text1: "Failed to fetch service packages",
          text2: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  useEffect(() => {
    if (allPackages && allPackages.length > 0) {
      const decorators = allPackages.filter((pkg) => {
        const services = Array.isArray(pkg.services_included)
          ? pkg.services_included.map((s) => s?.toLowerCase())
          : [];
        return services.includes("decorator");
      });

      const caterers = allPackages.filter((pkg) => {
        const services = Array.isArray(pkg.services_included)
          ? pkg.services_included.map((s) => s?.toLowerCase())
          : [];
        return services.includes("caterer");
      });

      setDecoratorPackages(decorators);
      setCatererPackages(caterers);
    }
  }, [allPackages]);

  // Select one decorator and one caterer
  const selectService = (service, type) => {
    if (type === "decorator") {
      if (selectedDecorator?._id === service._id) {
        setSelectedDecorator(null);
      } else {
        setSelectedDecorator(service);
      }
    } else if (type === "caterer") {
      if (selectedCaterer?._id === service._id) {
        setSelectedCaterer(null);
      } else {
        setSelectedCaterer(service);
      }
    }
  };

  // Navigate to booking page with selected services
  const handleBookNow = () => {
    const selectedServices = [...existingPackages]; // Start with existing packages

    if (selectedDecorator) selectedServices.push(selectedDecorator);
    if (selectedCaterer) selectedServices.push(selectedCaterer);

    if (selectedServices.length === 0) {
      Alert.alert(
        "No Service Selected",
        "Please select at least one service to proceed."
      );
      return;
    }

    router.push({
      pathname: "/bookCustomizeService",
      params: { selectedServices: JSON.stringify(selectedServices) },
    });
  };

  // Render single package card
  const renderPackage = (pkg, type) => {
    const isSelected =
      type === "decorator"
        ? selectedDecorator?._id === pkg._id
        : selectedCaterer?._id === pkg._id;

    return (
      <TouchableOpacity
        key={pkg._id}
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => selectService(pkg, type)}
        activeOpacity={0.7}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <View style={styles.selectionBadge}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}

        <Image
          source={{ uri: pkg.image || "https://via.placeholder.com/150" }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {pkg.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {pkg.description || "No description available"}
          </Text>
          <Text style={styles.price}>
            ₹{pkg.price?.toLocaleString("en-IN") || 0}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Loading packages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Additional Services</Text>
        <Text style={styles.subtitle}>
          Select one decorator and one caterer for your event
        </Text>

        {/* Existing Packages Summary */}
        {existingPackages.length > 0 && (
          <View style={styles.existingSection}>
            <Text style={styles.existingSectionTitle}>
              ✓ Already Selected ({existingPackages.length})
            </Text>
            {existingPackages.map((pkg, idx) => (
              <Text key={idx} style={styles.existingItem}>
                • {pkg.name} - ₹{pkg.price?.toLocaleString("en-IN")}
              </Text>
            ))}
          </View>
        )}

        {/* Decorator Packages Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.subHeader}>🎨 Decorators</Text>
            <Text style={styles.count}>
              {decoratorPackages.length} available
            </Text>
          </View>

          {decoratorPackages.length > 0 ? (
            decoratorPackages.map((pkg) => renderPackage(pkg, "decorator"))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noData}>No decorator packages available</Text>
            </View>
          )}
        </View>

        {/* Caterer Packages Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.subHeader}>🍽️ Caterers</Text>
            <Text style={styles.count}>{catererPackages.length} available</Text>
          </View>

          {catererPackages.length > 0 ? (
            catererPackages.map((pkg) => renderPackage(pkg, "caterer"))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noData}>No caterer packages available</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      {(selectedDecorator || selectedCaterer) && (
        <View style={styles.bottomContainer}>
          <View style={styles.selectionSummary}>
            <Text style={styles.selectedCount}>
              {(selectedDecorator ? 1 : 0) + (selectedCaterer ? 1 : 0)} service
              {selectedDecorator && selectedCaterer ? "s" : ""} selected
            </Text>
            <Text style={styles.totalPrice}>
              Total: ₹
              {(
                (selectedDecorator?.price || 0) +
                (selectedCaterer?.price || 0) +
                existingPackages.reduce((sum, pkg) => sum + (pkg.price || 0), 0)
              ).toLocaleString("en-IN")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookNow}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AdditionalService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  count: {
    fontSize: 13,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  selectedCard: {
    borderColor: "#e74c3c",
    backgroundColor: "#fef2f2",
  },
  selectionBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#e74c3c",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 3,
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    width: 110,
    height: 110,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
    lineHeight: 18,
  },
  price: {
    color: "#e74c3c",
    fontWeight: "700",
    fontSize: 16,
  },
  noDataContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  noData: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    color: "#64748b",
    marginTop: 12,
    fontSize: 14,
  },
  bottomContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectionSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedCount: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "700",
  },
  bookButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  existingSection: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  existingSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  existingItem: {
    fontSize: 13,
    color: "#3b82f6",
    marginLeft: 8,
    marginBottom: 4,
  },
});
