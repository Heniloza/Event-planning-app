import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { usePackageStore } from "../../store/packageStore.js";
import { useVendorAuthStore } from "../../store/vendorAuthStore.js";
import { useFocusEffect } from "@react-navigation/native";

const Packages = () => {
  const { packages, fetchPackage, deletePackage } = usePackageStore();
  const { vendor } = useVendorAuthStore();

  useFocusEffect(
    useCallback(() => {
      if (vendor?._id) {
        fetchPackage(vendor._id);
      }
    }, [vendor?._id])
  );

  const handleDelete = (packageId) => {
      deletePackage(packageId);
        if (vendor?._id) {
          fetchPackage(vendor._id);
        }
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: "#999" }}>No Image</Text>
        </View>
      )}

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description || "No description available"}
        </Text>
        <Text style={styles.cardPrice}>₹{item.price}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#e53935" }]}
            onPress={() => handleDelete(item?._id)}
          >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Packages</Text>

      {packages?.length > 0 ? (
        <FlatList
          data={packages}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.emptyText}>No Packages Found</Text>
      )}
    </View>
  );
};

export default Packages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  placeholder: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00897b",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 20,
  },
});
