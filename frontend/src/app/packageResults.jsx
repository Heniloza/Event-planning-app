import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  TextInput,
} from "react-native";
import { useState } from "react";
import { usePackageStore } from "../store/packageStore";
import { useBookingStore } from "../store/bookingStore";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

const PackageResults = () => {
  const { generatedPackages,userInputs } = usePackageStore();
  const { bookService } = useBookingStore();
  const { user } = useAuthStore();
  const { createNotification } = useNotificationStore();

  const [details, setDetails] = useState({});

  const handleInputChange = (pkgIndex, serviceType, field, value) => {
    setDetails((prev) => ({
      ...prev,
      [pkgIndex]: {
        ...prev[pkgIndex],
        [serviceType]: {
          ...prev[pkgIndex]?.[serviceType],
          [field]: value,
        },
      },
    }));
  };

  const handleBooking = (bundle, index) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to book this package?"
      );
      if (!confirmed) return;
      bookNow(bundle, index);
    } else {
      Alert.alert(
        "Confirm Booking",
        "Are you sure you want to book this package?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => bookNow(bundle, index) },
        ]
      );
    }
  };

const bookNow = async (bundle) => {
  try {
const payload = {
  userId: user?._id,
  services: bundle.services,
  eventDate: new Date().toISOString(),
  totalPrice: bundle?.totalPrice,

  serviceDetails: {
    venue: bundle.services?.Venue
      ? {
          guestCount: Number(userInputs?.venue?.guestCount || 0),
          budget: Number(
            userInputs?.venue?.budget || bundle.services?.Venue?.price || 0
          ),
          packageId: bundle.services.Venue._id,
        }
      : null,

    decorator: bundle.services?.Decorator
      ? {
          budget: Number(
            userInputs?.decorator?.budget ||
              bundle.services?.Decorator?.price ||
              0
          ),
          theme: userInputs?.decorator?.theme || null,
          packageId: bundle.services.Decorator._id,
        }
      : null,

    caterer: bundle.services?.Caterer
      ? {
          guestCount: Number(userInputs?.caterer?.guestCount || 0),
          budget: Number(
            userInputs?.caterer?.budget || bundle.services?.Caterer?.price || 0
          ),
          meals: userInputs?.caterer?.meals || [],
          packageId: bundle.services.Caterer._id,
        }
      : null,
  },
};

    console.log("Booking payload:", payload);
    const response = await bookService(payload);
    Alert.alert("Success", response?.message || "Booking successful!");

     Object.values(bundle.services).forEach((service) => {
       if (service.vendor?._id) {
         createNotification({
           userId: user?._id,
           vendorId: service.vendor?._id,
           title: "New Booking Request",
           message: `You have a new booking request for ${service.name}`,
           type: "booking",
         });
       }
     });

  } catch (err) {
    console.error("Booking error:", err.response?.data || err.message);
    Alert.alert(
      "Error",
      err.response?.data?.message || err.message || "Failed to book package."
    );
  }
};


  if (!generatedPackages || generatedPackages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No packages found. Try adjusting your budget.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {generatedPackages.map((bundle, index) => (
        <View key={bundle.id || index} style={styles.card}>
          <Text style={styles.cardTitle}>Package {index + 1}</Text>

          {Object.entries(bundle.services).map(([serviceType, service]) => (
            <View key={service._id} style={styles.serviceCard}>
              {service.image ? (
                <Image
                  source={{ uri: service.image }}
                  style={styles.serviceImage}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={{ color: "#777" }}>No Image</Text>
                </View>
              )}

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceType}>{serviceType}</Text>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>₹{service.price}</Text>
                {service.description ? (
                  <Text style={styles.serviceDesc}>{service.description}</Text>
                ) : null}
                <Text style={styles.vendorText}>
                  Vendor: {service.vendor?.business_name} (
                  {service.vendor?.owner_name})
                </Text>
                
              </View>
            </View>
          ))}

          <Text style={styles.totalPrice}>
            Total Price: ₹{bundle.totalPrice}
          </Text>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => handleBooking(bundle, index)}
          >
            <Text style={styles.bookText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#f4f6fa" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#333" },
  serviceCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  serviceImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  placeholderImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceInfo: { flex: 1 },
  serviceType: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A628A",
    textTransform: "capitalize",
  },
  serviceName: { fontSize: 15, fontWeight: "700", color: "#333" },
  servicePrice: { fontSize: 14, fontWeight: "600", color: "#2a9d8f", marginVertical: 2 },
  serviceDesc: { fontSize: 12, color: "#666", marginBottom: 2 },
  vendorText: { fontSize: 12, color: "#888" },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e76f51",
    marginVertical: 10,
    textAlign: "right",
  },
  bookBtn: {
    backgroundColor: "#4A628A",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  bookText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 6,
    marginTop: 6,
    fontSize: 12,
  },
});

export default PackageResults;
