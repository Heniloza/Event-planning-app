import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import AddPackage from "../../components/AddPackage.jsx";
import { useNavigation } from "expo-router";
import { useVendorAuthStore } from "../../store/vendorAuthStore.js";

export default function VendorHome() {
  const [isCreatePackage, setIsCreatePackage] = useState(false);
  const { vendor } = useVendorAuthStore();
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeTitle}>Welcome, {vendor?.owner_name}</Text>
      <Text style={styles.subText}>
        Manage your packages and grow your business effortlessly
      </Text>

      <View style={styles.bannerWrapper}>
        <Image
          source={require("../../assets/vendor_banner.png")}
          style={styles.bannerImage}
          resizeMode="contain" 
        />
        <View style={styles.bannerTextBox}>
          <Text style={styles.bannerText}>Empower Your Business </Text>
          <Text style={styles.bannerSubText}>
            Add packages, track bookings, and boost your reach
          </Text>
        </View>
      </View>

      <Text style={styles.heading}>Quick Actions</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsCreatePackage(true)}
        >
          <Text style={styles.buttonTextOne}>Add Package</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("packages")}
        >
          <Text style={styles.buttonTextTwo}>My Packages</Text>
        </TouchableOpacity>
      </View>

      {isCreatePackage && (
        <AddPackage onClose={() => setIsCreatePackage(false)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginTop: 16,
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  bannerWrapper: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  bannerImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
  },
  bannerTextBox: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 8,
  },
  bannerText: {
    color: "#e74c3c",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  bannerSubText: {
    color: "#444",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 16,
    marginBottom: 10,
    color: "#222",
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e74c3c",
  },
  buttonTextOne: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  buttonTextTwo: {
    color: "#e74c3c",
    fontWeight: "600",
    fontSize: 15,
  },
});
