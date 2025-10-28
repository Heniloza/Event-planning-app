// /app/user/_layout.js
import { Tabs } from "expo-router";
import { Home, User, Landmark, Users, Bell } from "lucide-react-native";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

function TabIcon({ icon: Icon, color, focused, size }) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: focused ? -20 : 0,
      }}
    >
      {focused ? (
        <View
          style={{
            position: "absolute",
            width: 55,
            height: 55,
            borderRadius: 27.5,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            top: -40,
          }}
        >
          <Icon color={color} size={size} />
        </View>
      ) : (
        <Icon color={color} size={size} />
      )}
    </View>
  );
}

export default function UserLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitle: "Festora",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          elevation: 5,
        },
        headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("userNotification")}
            style={{ marginRight: 15 }}
          >
            <Bell size={22} color="black" />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          position: "absolute",
          bottom: 0,
          elevation: 10,
          backgroundColor: "#E5D9B6",
          borderColor: "transparent",
          borderWidth: 1,
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.7)", // removes white border + adds shadow
        },
        tabBarActiveTintColor: "#5F8D4E",
        tabBarInactiveTintColor: "gray",
        tabBarLabel: ({ focused }) =>
          focused ? (
            <Text>
              {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
            </Text>
          ) : (
            ""
          ),
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon icon={Home} color={color} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="venues"
        options={{
          title: "Venues",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon
              icon={Landmark}
              color={color}
              focused={focused}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vendors"
        options={{
          title: "Vendors",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon icon={Users} color={color} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon icon={User} color={color} focused={focused} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
