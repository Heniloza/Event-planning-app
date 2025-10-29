import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAdminStore } from "../../store/adminStore";

const Reports = () => {
  const navigation = useNavigation();
  const { reports, fetchReports, markReportAsRead } = useAdminStore();
  const [activeTab, setActiveTab] = useState("unread")

  useEffect(() => {
    fetchReports();
  }, []);

  const unreadReports = reports.filter((r) => !r.read);
  const readReports = reports.filter((r) => r.read);

  const renderReport = ({ item }) => (
    <View style={styles.card}>
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
          <Text style={styles.username}>{item.userId?.name}</Text>
          <Text style={styles.email}>{item.userId?.email}</Text>
        </View>
      </View>

      <View style={styles.reportContent}>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>

      {!item.read && (
        <TouchableOpacity
          style={styles.readButton}
          onPress={() => markReportAsRead(item._id)}
        >
          <Text style={styles.readButtonText}>Mark as Read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const currentReports = activeTab === "unread" ? unreadReports : readReports;

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "unread" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("unread")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "unread" && styles.activeTabText,
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "read" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("read")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "read" && styles.activeTabText,
            ]}
          >
            Read
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {currentReports.length > 0 ? (
          <FlatList
            data={currentReports}
            keyExtractor={(item) => item._id}
            renderItem={renderReport}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>
            {activeTab === "unread"
              ? "No unread reports 🎉"
              : "No read reports yet 📭"}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    color: "#222",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  activeTabButton: {
    backgroundColor: "#e74c3c",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
    elevation: 3,
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
  readButton: {
    marginTop: 12,
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  readButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 15,
    color: "#888",
    marginVertical: 20,
  },
});
