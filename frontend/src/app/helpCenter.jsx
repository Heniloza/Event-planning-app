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
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const helpCenter = () => {
  const router = useRouter();
  const [issueType, setIssueType] = useState("Bug");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!description.trim()) {
      alert("Please enter a description of the problem.");
      return;
    }
    // TODO: send data to backend
    alert(`Issue reported: ${issueType}\n${description}`);
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

      {/* Report Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Report a Problem</Text>

        <Text style={styles.label}>Select Issue Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={issueType}
            onValueChange={(itemValue) => setIssueType(itemValue)}
          >
            <Picker.Item label="Bug" value="Bug" />
            <Picker.Item label="Payment Issue" value="Payment Issue" />
            <Picker.Item label="Booking Issue" value="Booking Issue" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>Describe the Problem</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your issue here..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>

      {/* Policies Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Policies</Text>
        <TouchableOpacity onPress={() => router.push("/privacyPolicy")}>
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/termsAndConditions")}>
          <Text style={styles.link}>Terms & Conditions</Text>
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
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  faqQ: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },
  faqA: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 15,
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
  link: {
    fontSize: 15,
    color: "#5F8D4E",
    marginTop: 8,
  },
});

export default helpCenter;
