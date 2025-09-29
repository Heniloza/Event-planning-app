import React, { useCallback, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { usePackageStore } from "../../store/packageStore.js";
import { useVendorAuthStore } from "../../store/vendorAuthStore.js";
import { useFocusEffect } from "@react-navigation/native";

const Packages = () => {
  const { packages, fetchPackage } = usePackageStore(); 
  const {vendor} = useVendorAuthStore(); 

   useFocusEffect(
     useCallback(() => {
       if (vendor?._id) {
         fetchPackage(vendor._id);
       }
     }, [vendor?._id])
   );

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
          {item.description}
        </Text>
        <Text style={styles.cardPrice}>₹{item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {packages?.length > 0 ? (
        <FlatList
          data={packages}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No Packages Found
        </Text>
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
});
