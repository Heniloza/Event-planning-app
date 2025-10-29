// app/helpCenter.jsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { useUserStore } from "../store/userStore.js";
import { useAuthStore } from "../store/authStore.js";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const HelpCenter = () => {
  const [description, setDescription] = useState("");
  const { user } = useAuthStore();
  const { sendReport } = useUserStore();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!description.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter a description of the problem.",
      });
      return;
    }

    sendReport({
      userId: user?._id,
      description,
    });
    setDescription("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header (same style as Privacy Policy) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQs</Text>

          <Text style={styles.faqQ}>Q: How can I book a service?</Text>
          <Text style={styles.faqA}>
            A: You can easily book services directly from the Home page by
            selecting your preferred package and proceeding with the booking
            process.
          </Text>

          <Text style={styles.faqQ}>
            Q: Can I cancel my booking from the app?
          </Text>
          <Text style={styles.faqA}>
            A: No, service cancellations cannot be made through the app. You
            must contact the respective service provider directly to cancel your
            booking.
          </Text>

          <Text style={styles.faqQ}>Q: Are the prices shown final?</Text>
          <Text style={styles.faqA}>
            A: The displayed prices are approximate and not final. They may vary
            depending on factors such as customization, season, or user
            preferences.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report a Problem</Text>

          <TextInput
            style={styles.input}
            placeholder="Describe the problem here..."
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  faqQ: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 8,
    color: "#444",
  },
  faqA: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 15,
    backgroundColor: "#fafafa",
    fontSize: 14,
    color: "#222",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: "#e74c3c",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default HelpCenter;
