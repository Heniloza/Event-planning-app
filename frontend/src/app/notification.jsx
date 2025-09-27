// /app/vendorNotification.js
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, CalendarDays, Bell } from "lucide-react-native"; 
import { useNotificationStore } from "../store/notificationStore";
import {useVendorAuthStore} from "../store/vendorAuthStore"

const notification = () => {
  const router = useRouter();
  const { vendor } = useVendorAuthStore();
  const { notifications, fetchVendorNotifications } = useNotificationStore();

  useEffect(() => {
    if (vendor?._id) {
      fetchVendorNotifications(vendor._id);
    }
  }, [vendor?._id]);

  const renderItem = ({ item }) => {
    let displayTitle = "";
    let displayMessage = "";
    let Icon = null;

    if (item.type === "booking") {
      displayTitle = "New Booking";
      displayMessage = `You received a new booking: ${item.message}`;
      Icon = CalendarDays;
    } else if (item.type === "reminder") {
      displayTitle = "Reminder";
      displayMessage = item.message;
      Icon = Bell;
    }

    return (
      <View style={styles.notificationCard}>
        {Icon && <Icon size={22} color="#4a90e2" style={{ marginRight: 10 }} />}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.message}>{displayMessage}</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
          <ArrowLeft size={24} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Vendor Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No new notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
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
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9faff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: { fontWeight: "700", fontSize: 15, marginBottom: 4, color: "#222" },
  message: { fontSize: 13, color: "#444" },
  date: { fontSize: 11, color: "#888", marginTop: 6 },
});

export default notification;
