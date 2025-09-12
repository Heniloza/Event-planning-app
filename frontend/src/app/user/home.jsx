import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { Search } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const { user } = useAuthStore();
  const navigation = useNavigation();

  const handleCategoryPress = (cat) => {
    if (cat === "Venues") {
      navigation.navigate("venues");
    } else {
      navigation.navigate("vendors", { type: cat }); 
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>Hi {user?.username || "Guest"}</Text>
      <Text style={styles.subText}>Find and book the best packages</Text>

      <View style={styles.searchBar}>
        <Search size={20} color="#777" />
        <TextInput
          placeholder="Search packages..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.banner}>
        <Image
          source={require("../../assets/banner.png")}
          style={styles.bannerImage}
        />
      </View>

      <View style={styles.categories}>
        {["Venues", "Catering", "Decor"].map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(cat)}
          >
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.bookBtn, styles.serviceBtn]}
        onPress={() => navigation.navigate("Vendors")}
      >
        <Text style={styles.bookBtnText}>Book Service</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Popular Packages</Text>
      <View style={styles.packagesRow}>
        {[1, 2].map((pkg) => (
          <View key={pkg} style={styles.packageCard}>
            <Image
              source={require("../../assets/default_logo2.webp")} 
              style={styles.packageImage}
            />
            <Text style={styles.packageTitle}>Wedding Package {pkg}</Text>
            <Text style={styles.packagePrice}>₹{pkg * 5000}</Text>

            <TouchableOpacity style={styles.bookBtn}>
              <Text style={styles.bookBtnText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E5D9B6",
    flex: 1,
    padding: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  banner: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
    marginTop: 10,
  },
  packagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  packageCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  packageImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  packageTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  packagePrice: {
    fontSize: 13,
    color: "#5F8D4E",
    marginVertical: 6,
  },
  bookBtn: {
    backgroundColor: "#5F8D4E",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  serviceBtn: {
    backgroundColor: "#4A628A",
    marginTop: 10,
  },
});
