import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, Camera } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../store/authStore";

const UpdateUserProfile = () => {
  const navigation = useNavigation();
  const { user, updateUserProfileImage, isUpdatingProfile } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    location: user?.location || "",
  });

  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

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
      setProfileImage(base64Img);

      updateUserProfileImage({
        profileImage: base64Img,
        userId: user?._id,
      });
    }
  } catch (error) {
    console.error("Error picking image:", error);
  }
};

  const handleUpdate = () => {
    const updatedData = { ...form, profileImage };
    console.log("Updated User Profile:", updatedData);

    // Call zustand store or API here
    // updateUserProfile(updatedData, user._id);
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image Section (Separate) */}
        <View style={styles.imageContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../assets/default_logo2.webp")
            }
            style={styles.profileImage}
          />

          <TouchableOpacity
            style={styles.cameraIconContainer}
            onPress={handlePickImage} 
          >
            <Camera size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Form Fields (Separate) */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => handleChange("phone", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            value={form.city}
            onChangeText={(text) => handleChange("city", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Location"
            value={form.location}
            onChangeText={(text) => handleChange("location", text)}
          />

          {/* Update Button */}
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateUserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 25,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#3498db",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  form: {
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  updateButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
