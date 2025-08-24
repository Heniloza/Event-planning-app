import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const vendorSignup = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    business_name: "",
    owner_name: "",
    email: "",
    phone: "",
    category: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const serviceCategories = ["Caterer", "Decorator", "Venue"];

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
    setShowCategoryDropdown(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

 

  const handleRegister = () => {
   navigation.navigate("otpVerification")
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

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Vendor Registration</Text>

          <View style={styles.formContainer}>
            {/* Business Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  errors.business_name && styles.inputError,
                ]}
                placeholder="Business Name"
                placeholderTextColor="#999999"
                value={formData.business_name}
                onChangeText={(value) =>
                  handleInputChange("business_name", value)
                }
              />
              {errors.business_name && (
                <Text style={styles.errorText}>{errors.business_name}</Text>
              )}
            </View>

            {/* Owner Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.owner_name && styles.inputError]}
                placeholder="Owner Name"
                placeholderTextColor="#999999"
                value={formData.owner_name}
                onChangeText={(value) => handleInputChange("owner_name", value)}
              />
              {errors.owner_name && (
                <Text style={styles.errorText}>{errors.owner_name}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                placeholderTextColor="#999999"
                value={formData.email}
                onChangeText={(value) =>
                  handleInputChange("email", value.toLowerCase())
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Phone Number"
                placeholderTextColor="#999999"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Service Category Dropdown */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  errors.category && styles.inputError,
                ]}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dropdownButtonText,
                    !formData.category && styles.placeholderText,
                  ]}
                >
                  {formData.category || "Service Category"}
                </Text>
                <Text style={styles.dropdownIcon}>
                  {showCategoryDropdown ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>

              {showCategoryDropdown && (
                <View style={styles.dropdownList}>
                  {serviceCategories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dropdownItem,
                        formData.category === category &&
                          styles.selectedDropdownItem,
                      ]}
                      onPress={() => handleCategorySelect(category)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          formData.category === category &&
                            styles.selectedDropdownItemText,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>

            {/* Location */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.location && styles.inputError]}
                placeholder="Location"
                placeholderTextColor="#999999"
                value={formData.location}
                onChangeText={(value) => handleInputChange("location", value)}
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("vendorLogin")}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
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
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  backIcon: { fontSize: 24, color: "#333333", fontWeight: "bold" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333333" },
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
  },
  inputError: { borderColor: "#e74c3c", backgroundColor: "#fdf2f2" },
  errorText: { color: "#e74c3c", fontSize: 12, marginTop: 5, marginLeft: 5 },
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
  dropdownButton: {
    height: 55,
    backgroundColor: "#f8f0f0",
    borderRadius: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: { fontSize: 16, color: "#333" },
  placeholderText: { color: "#999" },
  dropdownIcon: { fontSize: 12, color: "#666" },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownItem: { padding: 15 },
  selectedDropdownItem: { backgroundColor: "#e74c3c" },
  dropdownItemText: { fontSize: 16, color: "#333" },
  selectedDropdownItemText: { color: "#fff", fontWeight: "600" },
});

export default vendorSignup