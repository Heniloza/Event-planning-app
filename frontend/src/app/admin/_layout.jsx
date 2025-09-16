// /app/admin/_layout.jsx
import React from "react";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Users, FileText } from "lucide-react-native";

function TabIcon({ icon: Icon, label, color, focused }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", width: 70 }}>
      <Icon color={color} size={20} />
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          fontSize: 12,
          marginTop: 2,
          color: focused ? color : "gray",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "Admin Panel",
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#007AFF",
        tabBarStyle: { backgroundColor: "#fff", height: 60 },
      }}
    >
      <Tabs.Screen
        name="vendorRequests"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={Users}
              label="Requests"
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={FileText}
              label="Reports"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
