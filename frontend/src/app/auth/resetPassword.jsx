import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons"; 

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleSend = () => {
   navigation.navigate("newPassword");
  };

  return (
    <View style={styles.container}>
      {/* Top header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
      </View>

      {/* Instructions */}
      <Text style={styles.subtitle}>
        Please enter your email address to request a password reset
      </Text>

      {/* Input field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <MaterialIcons name="email" size={22} color="gray" />
      </View>

      {/* Send button */}
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 22,
    fontWeight: "600",
    color: "black",
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "black",
  },
  subtitle: {
    marginTop: 20,
    fontSize: 15,
    color: "gray",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 30,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft:10,
    borderRadius:10,
  },
  button: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
