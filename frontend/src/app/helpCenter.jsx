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

const HelpCenter = () => {
  const [description, setDescription] = useState("");
  const {user} = useAuthStore();
  const { sendReport } = useUserStore();


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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help Center</Text>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQs</Text>
        <Text style={styles.faqQ}>Q: How do I book a venue?</Text>
        <Text style={styles.faqA}>
          A: Go to the booking page, select your venue, date, and confirm.
        </Text>

        <Text style={styles.faqQ}>Q: Can I cancel my booking?</Text>
        <Text style={styles.faqA}>
          A: Yes, you can cancel from "My Bookings" page, depending on policy.
        </Text>

        <Text style={styles.faqQ}>Q: How do I update my profile?</Text>
        <Text style={styles.faqA}>
          A: Go to "Edit Profile" in the account section of your profile page.
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
           Submit Report
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
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
    fontWeight: "600",
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
    backgroundColor: "#5F8D4E",
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
