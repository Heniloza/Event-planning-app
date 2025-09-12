// /app/profile.js
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useAuthStore } from "../../store/authStore.js";
import { useRouter } from "expo-router";

export default function Profile() {
  const { user } = useAuthStore();
  const router = useRouter();

const handleNavigation = (title) => {
  const routes = {
    "Edit Profile": "updateUserProfile",
    "My Bookings": "userBookings",
    "Help Center": "helpCenter",
    "Privacy Policy": "privacyPolicy",
  };

  const route = routes[title];
  if (route) {
    router.push(`/${route}`);
  }
};


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={
            user?.profileImage
              ? { uri: user.profileImage }
              : require("../../assets/default_logo2.webp")
          }
          style={styles.avatar}

        />
        <Text style={styles.name}>{user?.name || "Guest User"}</Text>

        <Text style={styles.email}>{user?.email || "guest@email.com"}</Text>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <MenuItem title="Edit Profile" onPress={handleNavigation} />
        <MenuItem title="My Bookings" onPress={handleNavigation} />
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <MenuItem title="Help Center" onPress={handleNavigation} />
        <MenuItem title="Privacy Policy" onPress={handleNavigation} />
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ title, onPress }) => (
  <Pressable
    onPress={() => onPress(title)}
    android_ripple={null}
    style={styles.menuItem}
  >
    <Text style={styles.menuText}>{title}</Text>
    <ChevronRight size={20} color="#5F8D4E" />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5D9B6",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  menuText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "500",
  },
});
