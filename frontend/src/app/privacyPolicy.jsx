// app/privacyPolicy.jsx
import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 

const privacyPolicy = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.container}>
        <Text style={styles.updated}>Last updated: September 2025</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Information We Collect</Text>
          <Text style={styles.text}>
            We may collect personal details such as your name, email, phone
            number, and booking details to provide a better experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            - To manage your bookings {"\n"}- To improve our services {"\n"}- To
            communicate with you about updates or offers
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. Sharing of Information</Text>
          <Text style={styles.text}>
            We may share necessary details with vendors or payment partners to
            complete your bookings. We do not sell your personal data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Your Rights</Text>
          <Text style={styles.text}>
            You may request account deletion, update your personal info, or opt
            out of promotional messages anytime by contacting us.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about this Privacy Policy, please reach
            out to us at support@festora.com.
          </Text>
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
  updated: {
    fontSize: 12,
    color: "gray",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});

export default privacyPolicy;
