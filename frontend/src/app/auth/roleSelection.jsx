import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const RoleSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState(null);
  const scaleAnim = new Animated.Value(1);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);

    // Add a nice scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    setTimeout(() => {
      if (role === "vendor") {
        navigation.navigate("vendorLogin", { role });
      } else {
        navigation.navigate("userLogin", { role });
      }
    }, 200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Main Content Container */}
      <Animated.View
        style={[styles.contentContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Vendor Circle */}
        <TouchableOpacity
          style={[
            styles.roleCircle,
            selectedRole === "vendor" && styles.selectedCircle,
          ]}
          onPress={() => handleRoleSelection("vendor")}
          activeOpacity={0.9}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Image 
                source={require('../../assets/vendor-icon-image.png')}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
          </View>
          <Text style={styles.roleText}>Vendor</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* User Circle */}
        <TouchableOpacity
          style={[
            styles.roleCircle,
            selectedRole === "user" && styles.selectedCircle,
          ]}
          onPress={() => handleRoleSelection("user")}
          activeOpacity={0.9}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Image 
                source={require('../../assets/user-icon.png')}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
          </View>
          <Text style={styles.roleText}>User</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },

  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: width * 0.06,
    paddingVertical: height * 0.06,
    paddingHorizontal: width * 0.08,
    width: width * 0.9,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  roleCircle: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff6b6b",
    shadowColor: "#ff6b6b",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: "transparent",
  },

  selectedCircle: {
    borderColor: "#ffffff",
    transform: [{ scale: 1.08 }],
    shadowOpacity: 0.3,
  },

  iconContainer: {
    marginBottom: height * 0.015,
  },

  iconBackground: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.01,
  },

  iconImage: {
    width: "70%",
    height: "70%",
  },

  roleText: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  divider: {
    height: height * 0.05,
    width: "100%",
  },
});

export default RoleSelectionScreen;