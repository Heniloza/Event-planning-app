import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";

const UserSignup = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      city: "",
      password: "",
    });
  const navigation = useNavigation();
  const { signup, isSigningIn,user,isLoggedIn } = useAuthStore();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    signup(formData);
  };

    const handleLoginNavigation = () => {
      navigation.navigate("userLogin");
    };

   useEffect(() => {
        if (isLoggedIn) {
          navigation.replace("otpVerification"); 
        }
      }, [isLoggedIn,user]);

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

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>User Registration</Text>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* City */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#999"
              value={formData.city}
              onChangeText={(value) => handleInputChange("city", value)}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
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
      </ScrollView>
    </View>
  );
};

export default UserSignup;

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
  backIcon: { fontSize: 24, color: "#333", fontWeight: "bold" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  placeholder: { width: 40 },

  scrollContainer: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 30 },

  title: { fontSize: 28, fontWeight: "bold", marginBottom: 40 },

  formContainer: { marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  input: {
    height: 55,
    backgroundColor: "#f8f0f0",
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "transparent",
    color: "#333",
  },

  registerButton: {
    height: 55,
    backgroundColor: "#e74c3c",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  loginLink: { alignItems: "center", paddingVertical: 15 },
  loginLinkText: { color: "#666", fontSize: 16 },
});
