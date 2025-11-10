import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useVendorAuthStore } from "../../store/vendorAuthStore";
import { Picker } from "@react-native-picker/picker";


const VendorSignupScreen = () => {
  const navigation = useNavigation();
  const { signup, isSigningIn,vendor } = useVendorAuthStore();

  const [formData, setFormData] = useState({
    business_name: "",
    owner_name: "",
    email: "",
    phone: "",
    category: "",
    location: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 const handleSignup = async () => {
   const success = await signup(formData);
   if (success) {
     navigation.navigate("vendorLogin"); 
   }
 };
  const handleLoginNavigation = () => {
    navigation.navigate("vendorLogin"); 
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Festora</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Vendor Registration</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          placeholderTextColor="#999"
          value={formData.business_name}
          onChangeText={(value) => handleInputChange("business_name", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          placeholderTextColor="#999"
          value={formData.owner_name}
          onChangeText={(value) => handleInputChange("owner_name", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          value={formData.phone}
          onChangeText={(value) => handleInputChange("phone", value)}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.dropdownWrapper}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              style={styles.picker}
              dropdownIconColor="#e74c3c"
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Caterer" value="Caterer" />
              <Picker.Item label="Decorator" value="Decorator" />
              <Picker.Item label="Venue" value="Venue" />
              <Picker.Item label="All" value="All" />
            </Picker>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#999"
          value={formData.location}
          onChangeText={(value) => handleInputChange("location", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleSignup}
          activeOpacity={0.8}
          disabled={isSigningIn}
        >
          {isSigningIn ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={handleLoginNavigation}
          activeOpacity={0.7}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? Log In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VendorSignupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: { fontSize: 24, fontWeight: "bold", color: "#333" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  placeholder: { width: 40 },

  content: { flex: 1, paddingHorizontal: 20, paddingVertical: 40 },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },

  input: {
    height: 55,
    backgroundColor: "#f8f0f0",
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },

  registerButton: {
    height: 55,
    backgroundColor: "#e74c3c",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  pickerContainer: {
    height: 55,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    marginLeft: 5,
  },

  dropdownWrapper: {
    marginBottom: 20,
  },

  pickerContainer: {
    height: 55,
    backgroundColor: "#f8f0f0",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e74c3c",
    justifyContent: "center",
    paddingHorizontal: 10,
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  picker: {
    color: "#333",
    fontSize: 16,
  },

  loginLink: { alignItems: "center", paddingVertical: 15 },
  loginLinkText: { color: "#666", fontSize: 16 },
});
