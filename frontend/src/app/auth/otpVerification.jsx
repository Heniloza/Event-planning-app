import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import OtpInput from "../../components/OtpInput.jsx";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore.js";
import { verifyOtp } from "../../api/api.js";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";


const VerifyOtp = () => {
  const [otp, setOtp] = useState([]);
  const [counter, setCounter] = useState(60);
  const navigation = useNavigation();
  const { user, setIsLoggedIn, isAuthenticated, setIsAuthenticated } =
    useAuthStore();

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleVerification = async () => {

    const res = await verifyOtp(user?._id, otp);

    if (res?.success) {
      if(Platform.OS === "web"){
        console.log("Skipping token storage on web");
        
      }else{
  
       await SecureStore.setItemAsync("authToken", res.token);
       const storedToken = await SecureStore.getItemAsync("authToken");
       console.log("Stored token in SecureStore:", storedToken);
      }
       Toast.show({
        type: "success",
        text1: "Verified Successfully",
      });
      setIsLoggedIn(true);
      setIsAuthenticated(true);
      router.replace("/user/home");
    }
  };

  const onOtpSubmit = (otpString) => {
    const digits = otpString.split("").map((digit) => Number(digit));
    setOtp(digits);
  };

  const handleResendOtp = () => {
    setCounter(60);
    
    Toast.show({
      type: "info",
      text1: "New OTP sent",
    });
  };

  useEffect(()=>{
    if(isAuthenticated){
     router.replace("/user/home");
    }
  },[isAuthenticated])

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
      </View>

      {/* Content */}
      <View style={styles.leftContainer}>
        <Text style={styles.title}>
          We have sent the verification code to your email
        </Text>
        <Text style={styles.subtitle}>Enter it below to continue</Text>

        <View style={{ marginTop: 24 }}>
          <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
        </View>

        <TouchableOpacity
          onPress={handleVerification}
          style={styles.verifyButton}
        >
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          {counter > 0 ? (
            <Text style={{ fontSize: 14, color: "gray" }}>
              Resend OTP in <Text style={{ color: "#e74c3c" }}>{counter}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text
                style={{ fontSize: 14, color: "#e74c3c", fontWeight: "600" }}
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Right illustration */}
      <View style={styles.rightContainer}>
        <Image
          source={require("../../assets/otp-icon.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column", backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backText: { fontSize: 16, fontWeight: "500" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 40,
  },
  leftContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  rightContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "600", textAlign: "center" },
  subtitle: { marginTop: 16, fontSize: 16, textAlign: "center" },
  verifyButton: {
    marginTop: 40,
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 25,
  },
  verifyText: { color: "white", fontSize: 20, fontWeight: "bold" },
  image: { width: 300, height: 300 },
});
