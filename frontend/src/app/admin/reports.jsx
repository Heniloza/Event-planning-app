import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAdminStore } from "../../store/adminStore";

const Reports = () => {
  const navigation = useNavigation();
  const { reports, fetchReports } = useAdminStore();

  useEffect(() => {
    fetchReports();
  }, []);

  const renderReport = ({ item }) => (
    <View style={styles.card}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={
            item.userId?.profileImage
              ? { uri: item.userId.profileImage }
              : require("../../assets/default_logo2.webp")
          }
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>
            {item.userId?.name}
          </Text>
          <Text style={styles.email}>{item.userId?.email}</Text>
        </View>
      </View>

      {/* Report Description */}
      <View style={styles.reportContent}>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Timestamp */}
      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Reports</Text>
      </View>

      {/* Reports List */}
      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        renderItem={renderReport}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reports found 🚫</Text>
        }
      />
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    color: "#222",
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 13,
    color: "#777",
  },
  reportContent: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    textAlign: "right",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 50,
  },
});
