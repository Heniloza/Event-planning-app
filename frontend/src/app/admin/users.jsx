import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { axiosInstance } from "../../api/api";
import Toast from "react-native-toast-message";
import { useAdminStore } from "../../store/adminStore";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { deleteUser } = useAdminStore();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/auth/getAllUsers");
      const filteredUsers = (res.data.users || []).filter(
        (user) => user.role !== "admin"
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      Toast.show({
        type: "error",
        text1:
          error.response?.data?.message ||
          error.message ||
          "Failed to load users",
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleDeleteUser = async (userId) => {
     deleteUser(userId);
     await loadUsers();
  };

  const getRoleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return { bg: "#DBEAFE", text: "#1E40AF" };
      case "user":
        return { bg: "#E0E7FF", text: "#4338CA" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
        }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 12, color: "#6B7280", fontSize: 16 }}>
          Loading users...
        </Text>
      </View>
    );
  }

  const renderUserCard = ({ item }) => {
    const roleStyle = getRoleStyle(item.role);

    return (
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 14,
          marginHorizontal: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 12,
                borderWidth: 2,
                borderColor: "#E5E7EB",
              }}
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 12,
                backgroundColor: "#8B5CF6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                {item.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 3,
              }}
              numberOfLines={1}
            >
              {item.name || "Unnamed User"}
            </Text>
            <Text style={{ color: "#6B7280", fontSize: 13 }} numberOfLines={1}>
              {item.email || "No email"}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: roleStyle.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: roleStyle.text,
                fontWeight: "600",
                fontSize: 10,
                textTransform: "uppercase",
              }}
            >
              {item.role || "User"}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: "#6B7280", fontSize: 13 }}>
            {item.phone || "No phone"}
          </Text>
          <Text style={{ color: "#6B7280", fontSize: 13 }}>
            {item.city || "No city"}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#EF4444",
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => handleDeleteUser(item?._id)}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            Delete User
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View
        style={{
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          paddingBottom: 14,
          paddingTop: 20,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: "#6B7280", fontSize: 13 }}>
          {users.length} {users.length === 1 ? "user" : "users"} total
        </Text>
      </View>

      {users?.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUserCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#9CA3AF", fontSize: 16 }}>No users found</Text>
          <Text style={{ color: "#9CA3AF", fontSize: 13, marginTop: 6 }}>
            Pull down to refresh
          </Text>
        </View>
      )}
    </View>
  );
};

export default Users;
