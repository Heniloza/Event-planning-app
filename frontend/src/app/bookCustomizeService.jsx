import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { usePackageStore } from "../store/packageStore";
import { useBookingStore } from "../store/bookingStore";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

const BookCustomizeService = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { allPackages, fetchAllPackages } = usePackageStore();
  const { bookService } = useBookingStore();
  const { user } = useAuthStore();
  const { createNotification } = useNotificationStore();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (allPackages.length === 0) {
        await fetchAllPackages();
      }
      const pkg = allPackages.find((p) => p._id === id);
      setSelectedPackage(pkg || null);
      setLoading(false);
    };
    fetchData();
  }, [id, allPackages]);

  const handleBooking = async () => {
    if (!selectedPackage || !selectedPackage._id) {
      Alert.alert("Error", "Package details are missing.");
      return;
    }

    if (!eventDate) {
      Alert.alert("Error", "Please select an event date before booking.");
      return;
    }

    const confirmBooking = async () => {
      try {
        const payload = {
          userId: user?._id,
          services: {
            [selectedPackage.type || "Venue"]: {
              _id: selectedPackage._id,
              name: selectedPackage.name,
              price: selectedPackage.price,
              vendor: selectedPackage.vendor?._id,
            },
          },
          totalPrice: selectedPackage.price || 0,
          eventDate: eventDate.toISOString(),
        };

        const response = await bookService(payload);
        Alert.alert(
          "Success",
          response?.message || "Package booked successfully!"
        );

        if (selectedPackage.vendor?._id) {
          await createNotification({
            userId: user?._id,
            vendorId: selectedPackage.vendor._id,
            title: "New Booking Request",
            message: `You have a new booking for ${selectedPackage.name}`,
            type: "booking",
          });
        }

      } catch (err) {
        console.error("Booking error:", err.response?.data || err.message);
        Alert.alert(
          "Error",
          err.response?.data?.message ||
            err.message ||
            "Failed to book package."
        );
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to book this service?")) {
        confirmBooking();
      }
    } else {
      Alert.alert(
        "Confirm Booking",
        "Are you sure you want to book this service?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: confirmBooking },
        ]
      );
    }
  };

  // Date picker rendering logic
  const renderDatePicker = () => {
    if (Platform.OS === "web") {
      return (
        <input
          type="date"
          value={eventDate.toISOString().split("T")[0]}
          onChange={(e) => setEventDate(new Date(e.target.value))}
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
            width: "100%",
            marginBottom: 10,
            fontSize: 16,
          }}
        />
      );
    } else {
      return (
        <>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateBtnText}>
              📅 {eventDate.toDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selected) => {
                setShowDatePicker(false);
                if (selected) setEventDate(selected);
              }}
            />
          )}
        </>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={{ marginTop: 10 }}>Loading package details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      {selectedPackage ? (
        <View style={styles.card}>
          {selectedPackage.image && (
            <Image
              source={{ uri: selectedPackage.image }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <Text style={styles.name}>{selectedPackage.name}</Text>
          <Text style={styles.price}>₹{selectedPackage.price}</Text>
          {selectedPackage.vendor?.location && (
            <Text style={styles.location}>
              📍 {selectedPackage.vendor.location}
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.noData}>Package not found.</Text>
      )}

      {/* Date Picker */}
      <Text style={styles.label}>Select Event Date:</Text>
      {renderDatePicker()}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/additionalService")}
      >
        <Text style={styles.addBtnText}>Add More Services</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bookBtn} onPress={handleBooking}>
        <Text style={styles.bookBtnText}>Book Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookCustomizeService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backText: {
    fontSize: 20,
    color: "#e74c3c",
  },
  card: {
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#27ae60",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  dateBtn: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateBtnText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  addBtn: {
    backgroundColor: "#e67e22",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bookBtn: {
    backgroundColor: "#e74c3c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
