import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import OtpInput from "../../components/OtpInput.jsx";
import { useNavigation } from "@react-navigation/native";

const VerifyOtp = () => {
  const [otp, setOtp] = useState([]);
  const navigation = useNavigation();

  const [counter, setCounter] = useState(60);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleVerification = async () => {
   
  };

  const onOtpSubmit = (otpString) => {
    const digits = otpString.split("").map((digit) => Number(digit));
    setOtp(digits);
  };

  const handleResendOtp = () => {
   
    setCounter(60);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
      </View>

      {/* Left section */}
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

        {/* Resend OTP countdown */}
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
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
  },
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
  rightContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  verifyButton: {
    marginTop: 40,
   backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 6,
  },
  verifyText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
});
