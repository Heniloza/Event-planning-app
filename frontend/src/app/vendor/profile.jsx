import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Briefcase,
  Mail,
  MapPin,
  Phone,
  Camera,
  LogOut,
} from "lucide-react-native";
import { useVendorAuthStore } from "../../store/vendorAuthStore";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const VendorProfile = () => {
  const { vendor, updateVendorProfile, isUpdatingProfile, logout } =
    useVendorAuthStore();
  const navigation = useNavigation();

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
        await updateVendorProfile(base64Img, vendor?._id);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };
const handleLogout = async () => {
  await logout();
  navigation.reset({
    index: 0,
    routes: [{ name: "auth", params: { screen: "vendorLogin" } }],
  });
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handlePickImage}
          >
            <Camera size={18} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{vendor?.business_name}</Text>
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

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("UpdateProfile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VendorProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
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
    backgroundColor: "#f2f2f2",
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
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  logoutText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
