// /app/userNotification.js
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
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

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      {item.userId?"": <Text style={styles.title}>{item.title}</Text>}
      {item.userId? "":<Text style={styles.message}>{item.message}</Text>}
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
          <ArrowLeft size={24} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      {/* Body */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No new notifications</Text>
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
  headerText: { fontSize: 18, fontWeight: "bold" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  notificationCard: {
    backgroundColor: "#f4f6fa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontWeight: "700", fontSize: 14, marginBottom: 4 },
  message: { fontSize: 13, color: "#555" },
  date: { fontSize: 11, color: "#888", marginTop: 4 },
});

export default UserNotification;
