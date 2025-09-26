import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

const Notification = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header with Back Button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
          <ArrowLeft size={24} color="black" />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Notifications</Text>
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No new notifications</Text>
      </View>
    </View>
  );
};

export default Notification;
