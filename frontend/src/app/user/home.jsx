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
import { useEffect, useState } from "react";
import { usePackageStore } from "../../store/packageStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const { allPackages, fetchAllPackages } = usePackageStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchAllPackages();
  }, []);

  const handleSearch = () => {

    const filtered = allPackages.filter(
      (pkg) =>
        pkg.name?.toLowerCase().includes(query.toLowerCase()) ||
        pkg.category?.toLowerCase().includes(query.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(query.toLowerCase())
    );
    
    setResults(filtered);
  };

  const handleCategoryPress = (cat) => {
    if (cat === "Venues") {
      navigation.navigate("venues");
    } else {
      navigation.navigate("vendors", { type: cat });
    }
  };

  
  return (
      <ScrollView style={styles.container}>
        <Text style={styles.greeting}>Hi {user?.name || "Guest"}</Text>
        <Text style={styles.subText}>
          Find and book the best event packages
        </Text>

        <View style={styles.searchBar}>
          <Search size={20} color="#777" />
          <TextInput
            placeholder="Search for 'wedding', 'decor', 'catering'..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
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
          onPress={() => navigation.navigate("BookService")}
        >
          <Text style={styles.bookBtnText}>Book Service</Text>
        </TouchableOpacity>

        {query.trim() && results.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <View style={styles.packagesRow}>
              {results.map((pkg, i) => (
                <View key={i} style={styles.packageCard}>
                  <Image
                    source={{
                      uri: pkg.image || "https://via.placeholder.com/150",
                    }}
                    style={styles.packageImage}
                  />
                  <Text style={styles.packageTitle}>{pkg.name}</Text>
                  <Text style={styles.packagePrice}>₹{pkg.price}</Text>
                  <Text style={styles.categoryText}>
                    {pkg.category || "General"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {query.trim() && results.length === 0 && (
          <View style={styles.noResultContainer}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/7486/7486744.png",
              }}
              style={styles.noResultImage}
            />
            <Text style={styles.noResultText}>No matching packages found</Text>
          </View>
        )}
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
    flexWrap: "wrap",
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
    paddingVertical: 10,
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
  noResultContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  noResultImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  noResultText: {
    fontSize: 16,
    color: "#777",
    fontWeight: "500",
  },
});
