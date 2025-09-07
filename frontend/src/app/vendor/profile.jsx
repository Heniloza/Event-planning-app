import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Mail, Phone } from "lucide-react-native";
import { useVendorAuthStore } from "../../store/vendorAuthStore";

const VendorProfile = () => {
  const { vendor } = useVendorAuthStore();
  
  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image
        source={
          vendor?.logo
            ? { uri: vendor?.logo }
            : require("../../assets/user-icon.png")
        }
        style={styles.avatar}
      />

      {/* Name & Info */}
      <Text style={styles.name}>{vendor?.owner_name}</Text>
      <Text style={styles.role}>{vendor?.category}</Text>
      <Text style={styles.location}>{vendor?.location}</Text>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.contactRow}>
          <Mail size={20} color="#e74c3c" />
          <Text style={styles.contactText}>{vendor?.email}</Text>
        </View>
        <View style={styles.contactRow}>
          <Phone size={20} color="#e74c3c" />
          <Text style={styles.contactText}>{vendor?.phone}</Text>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          {vendor?.description
            ? vendor?.description
            : "No description available."}
        </Text>
      </View>
    </View>
  );
};

export default VendorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  role: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#333",
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
});
