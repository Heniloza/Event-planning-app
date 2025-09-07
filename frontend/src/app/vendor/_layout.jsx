// /app/vendor/_layout.js
import { Tabs ,useRouter} from "expo-router";
import { Home, Package, User, Calendar, Bell } from "lucide-react-native";
import { Pressable, View } from "react-native";

function TabIcon({ icon: Icon, color, focused, size }) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: focused ? -20 : 0,
      }}
    >
      {focused && (
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
      )}
      {!focused && <Icon color={color} size={size} />}
    </View>
  );
}

export default function VendorLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitle: "Dashboard",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          position: "absolute",
          bottom: 0,
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        tabBarLabel: ({ focused }) =>
          focused
            ? route.name.charAt(0).toUpperCase() + route.name.slice(1)
            : "",

        headerRight: () => (
          <Pressable
            style={{ marginRight: 15 }}
            onPress={() => router.push("/notification")}
          >
            <Bell size={22} color="black" />
          </Pressable>
        ),
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon icon={Home} color={color} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="packages"
        options={{
          title: "Your Packages",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon
              icon={Package}
              color={color}
              focused={focused}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon
              icon={Calendar}
              color={color}
              focused={focused}
              size={size}
            />
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
