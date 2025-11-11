import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useVendorAuthStore } from "../store/vendorAuthStore";
import { usePackageStore } from "../store/packageStore";
import { Ionicons } from "@expo/vector-icons"; // ✅ for back icon
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const PackageHistory = () => {
  const { vendor } = useVendorAuthStore();
  const { fetchPackageHistory } = usePackageStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchPackageHistory(vendor?._id);
        setHistory(data || []);
      } catch (error) {
        console.log("Error loading package history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (vendor?._id) loadHistory();
  }, [vendor]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Loading package history...</Text>
      </SafeAreaView>
    );
  }

  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#e74c3c" />
          </TouchableOpacity>
          <Text style={styles.header}>Package History</Text>
        </View>
        <Text style={styles.emptyText}>No package history found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#e74c3c" />
          </TouchableOpacity>
          <Text style={styles.header}>Package History</Text>
          <View style={{ width: 26 }} /> 
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={
                  item.image
                    ? { uri: item.image }
                    : require("../assets/default_logo2.webp")
                }
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.description}>
                  {item.description || "No description provided"}
                </Text>
                <Text style={styles.date}>
                  Added on: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default PackageHistory;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  price: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "600",
    marginVertical: 2,
  },
  description: {
    fontSize: 13,
    color: "#555",
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 8,
    color: "#555",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
