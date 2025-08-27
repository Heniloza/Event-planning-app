import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OtpInput = ({ length = 6, onOtpSubmit }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    if (isNaN(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text.slice(-1); 
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length && !newOtp.includes("")) {
      onOtpSubmit(combinedOtp);
    }

    if (text && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={value}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  input: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
  },
});
