import  { useEffect, useState } from "react";
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
import { useAuthStore } from "../../store/authStore";

const UserLoginScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { user, login, isLoggingIn, isLoggedIn, setIsLoggedIn } =
    useAuthStore();
  const navigation = useNavigation();


  
      const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      };


  const handleForgotPassword = () => {
    navigation.navigate("resetPassword"); 
  };

  const handleLogin = () => {
    login(formData);
  };

  const handleSignupNavigation = () => {
    navigation.navigate("userSignup"); 
  };

    useEffect(() => {
      if (isLoggedIn) {
        navigation.replace("otpVerification"); 
      }
    }, [isLoggedIn,user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Festora</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>User Login</Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999999"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999999"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
          />
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Signup Link */}
        <TouchableOpacity
          style={styles.signupLink}
          onPress={handleSignupNavigation}
          activeOpacity={0.7}
        >
          <Text style={styles.signupLinkText}>
            Don’t have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    fontSize: 24,
    color: "#333333",
    fontWeight: "bold",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },

  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 40,
    textAlign: "left",
  },

  inputContainer: {
    marginBottom: 20,
  },

  input: {
    height: 55,
    backgroundColor: "#f8f0f0",
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333333",
    borderWidth: 1,
    borderColor: "transparent",
  },

  inputError: {
    borderColor: "#e74c3c",
    backgroundColor: "#fdf2f2",
  },


  loginButton: {
    height: 55,
    backgroundColor: "#e74c3c",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#e74c3c",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  signupLink: {
    alignItems: "center",
    paddingVertical: 15,
  },

  signupLinkText: {
    color: "#666666",
    fontSize: 16,
    textAlign: "center",
  },

  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },

  forgotPasswordText: {
    color: "orange",
    fontSize: 14,
    fontWeight: "600",
  },
});
