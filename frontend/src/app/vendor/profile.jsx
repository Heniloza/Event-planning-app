import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Briefcase, Mail, MapPin, Phone, Camera } from "lucide-react-native";
import { useVendorAuthStore } from "../../store/vendorAuthStore";

const VendorProfile = () => {
  const { vendor, updateVendorProfile, isUpdatingProfile } =
    useVendorAuthStore();


   const handlePickImage = async () => {
     try {
       const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.7,
         base64: true, 
       });

       if (!result.canceled) {
         const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;

         updateVendorProfile(base64Img,vendor?._id);

       }
     } catch (error) {
       console.error("Error picking image:", error);
     } 
   };

   
  if (isUpdatingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Updating Profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            vendor?.logo
              ? { uri: vendor?.logo }
              : require("../../assets/default_logo2.webp")
          }
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage}>
          <Camera size={18} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{vendor?.owner_name}</Text>

      <View style={styles.infoRow}>
        <Briefcase size={16} color="#555" />
        <Text style={styles.role}>{vendor?.category}</Text>
      </View>

      <View style={styles.infoRow}>
        <MapPin size={16} color="#555" />
        <Text style={styles.location}>{vendor?.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>

        <View style={styles.contactRow}>
          <View style={styles.iconWrapper}>
            <Mail size={18} color="#555" />
          </View>
          <Text style={styles.contactText}>{vendor?.email}</Text>
        </View>

        <View style={styles.contactRow}>
          <View style={styles.iconWrapper}>
            <Phone size={18} color="#555" />
          </View>
          <Text style={styles.contactText}>{vendor?.phone}</Text>
        </View>
      </View>

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
    backgroundColor: "#fff", // same as your screenshot
    padding: 20,
  },
  avatarContainer: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f2f2f2", // light gray background, subtle like in the design
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  role: {
    fontSize: 15,
    color: "#555",
    marginLeft: 6,
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginLeft: 6,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconWrapper: {
    backgroundColor: "#f2f2f2",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  contactText: {
    fontSize: 14,
    color: "#333",
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
});
