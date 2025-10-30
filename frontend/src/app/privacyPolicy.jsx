import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={{
          height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.container}>
        <Text style={styles.updated}>Last updated: September 2025</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Information We Collect</Text>
          <Text style={styles.text}>
            When you use Festora, we may collect personal details such as your
            name, email, phone number, and booking preferences. We also collect
            information about the packages and vendors you interact with on our
            platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            - To create and manage your bookings {"\n"}- To connect you with
            vendors directly {"\n"}- To share your details with vendors so they
            can contact you for service-related discussions {"\n"}- To improve
            our platform experience {"\n"}- To communicate updates, offers, and
            reminders
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. Sharing of Information</Text>
          <Text style={styles.text}>
            Festora acts only as a platform to connect users with vendors. We
            share your contact details and booking requirements with vendors to
            help them serve you better. Vendors may directly reach out to you to
            discuss services, packages, or customizations. We never sell your
            personal information to third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Pricing and Packages</Text>
          <Text style={styles.text}>
            The prices shown on Festora are provided by vendors. They may vary
            depending on guest count, selected items, themes, and vendor
            choices. Festora does not fix package prices and is not responsible
            for vendor changes in pricing or availability.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions regarding this Privacy Policy, please
            reach out to us at ozahenil@gmail.com. We are committed to ensuring
            your privacy and providing a safe booking experience.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
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

export default PrivacyPolicy;
