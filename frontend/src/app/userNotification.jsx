// /app/userNotification.js
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle,
  Gift,
} from "lucide-react-native";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

const UserNotification = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { notifications, fetchUserNotifications } = useNotificationStore();

  useEffect(() => {
    if (user?._id) {
      fetchUserNotifications(user._id);
    }
  }, [user?._id]);

  const getNotificationTitle = (type) => {
    switch (type) {
      case "booking":
        return "Booking Placed Successfully";
      case "reminder":
        return "Upcoming Event Reminder";
      default:
        return "Notification";
    }
  };

  const renderItem = ({ item }) => {
    let displayTitle = getNotificationTitle(item.type);
    let displayMessage = "";

    if (item.userId) {
      if (item.type === "booking") {
        displayMessage = `Your booking for ${
          item.message.split("for ")[1]
        } has been placed successfully.`;
      } else {
        displayMessage = item.message;
      }
    } else {
      displayMessage = item.message;
    }

    return (
      <View style={styles.notificationCard}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            {item.type === "booking" ? (
              <CheckCircle size={22} color="#4CAF50" />
            ) : item.type === "reminder" ? (
              <Calendar size={22} color="#FF9800" />
            ) : item.type === "promotion" ? (
              <Gift size={22} color="#9C27B0" />
            ) : (
              <Bell size={22} color="#4A628A" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{displayTitle}</Text>
            <Text style={styles.message}>{displayMessage}</Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
          <ArrowLeft size={24} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 16, color: "#777" }}>
            No new notifications 📭
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
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
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  notificationCard: {
    backgroundColor: "#f9f9ff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "flex-start" },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e9ecf5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  title: { fontWeight: "700", fontSize: 15, marginBottom: 4, color: "#333" },
  message: { fontSize: 13, color: "#555", marginBottom: 4 },
  date: { fontSize: 11, color: "#888" },
});

export default UserNotification;
