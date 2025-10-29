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
  const { id, selectedServices } = useLocalSearchParams();
  const { allPackages, fetchAllPackages } = usePackageStore();
  const { bookService } = useBookingStore();
  const { user } = useAuthStore();
  const { createNotification } = useNotificationStore();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (allPackages.length === 0) {
        await fetchAllPackages();
      }

      let packagesToDisplay = [];

      if (selectedServices) {
        try {
          const parsed = JSON.parse(selectedServices);
          packagesToDisplay = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          console.error("Error parsing selected services:", e);
        }
      }
      else if (id) {
        const pkg = allPackages.find((p) => p._id === id);
        if (pkg) packagesToDisplay = [pkg];
      }

      setPackages(packagesToDisplay);
      setLoading(false);
    };
    fetchData();
  }, [id, selectedServices, allPackages]);

  const getTotalPrice = () => {
    return packages.reduce((sum, pkg) => sum + (pkg.price || 0), 0);
  };

  const handleBooking = async () => {
    if (packages.length === 0) {
      Alert.alert("Error", "No packages selected.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(eventDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert(
        "Invalid Date",
        "Please select a date that is today or in the future."
      );
      return;
    }

    const confirmBooking = async () => {
      try {
        const servicesObj = {};
        packages.forEach((pkg) => {
          let serviceType = pkg.type;

          if (
            Array.isArray(pkg.services_included) &&
            pkg.services_included.length > 0
          ) {
            serviceType = pkg.services_included[0];
          }

          if (!serviceType) {
            serviceType = "Other";
          }

          servicesObj[serviceType] = {
            _id: pkg._id,
            name: pkg.name,
            price: pkg.price,
            vendor: pkg.vendor?._id,
          };
        });

        console.log("Services Object:", servicesObj);

        const payload = {
          userId: user?._id,
          services: servicesObj,
          totalPrice: getTotalPrice(),
          eventDate: eventDate.toISOString(),
        };

        console.log("Booking Payload:", payload); 

        const response = await bookService(payload);
        Alert.alert(
          "Success",
          response?.message || "Services booked successfully!",
          [{ text: "OK", onPress: () => router.push("/") }]
        );

        for (const pkg of packages) {
          if (pkg.vendor?._id) {
            await createNotification({
              userId: user?._id,
              vendorId: pkg.vendor._id,
              title: "New Booking Request",
              message: `You have a new booking for ${pkg.name}`,
              type: "booking",
            });
          }
        }
      } catch (err) {
        console.error("Booking error:", err.response?.data || err.message);
        Alert.alert(
          "Error",
          err.response?.data?.message ||
            err.message ||
            "Failed to book services."
        );
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to book these services?")) {
        confirmBooking();
      }
    } else {
      Alert.alert(
        "Confirm Booking",
        "Are you sure you want to book these services?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: confirmBooking },
        ]
      );
    }
  };

  const renderDatePicker = () => {
    const today = new Date().toISOString().split("T")[0];

    if (Platform.OS === "web") {
      return (
        <input
          type="date"
          min={today}
          value={eventDate.toISOString().split("T")[0]}
          onChange={(e) => {
            const selected = new Date(e.target.value);
            setEventDate(selected);
          }}
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

  const renderPackageCard = (pkg, index) => (
    <View key={pkg._id || index} style={styles.card}>
      {pkg.image && (
        <Image
          source={{ uri: pkg.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.name}>{pkg.name}</Text>
        <Text style={styles.type}>
          {pkg.type || "Service"} • {pkg.vendor?.name || "Vendor"}
        </Text>
        {pkg.vendor?.location && (
          <Text style={styles.location}>📍 {pkg.vendor.location}</Text>
        )}
        <Text style={styles.price}>
          ₹{pkg.price?.toLocaleString("en-IN") || 0}
        </Text>
      </View>
    </View>
  );

  if (loading){
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
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Services</Text>
        <View style={{ width: 60 }} />
      </View>

      {packages.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Selected Services</Text>
          {packages.map((pkg, index) => renderPackageCard(pkg, index))}

          {/* Total Price Section */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>
              ₹{getTotalPrice().toLocaleString("en-IN")}
            </Text>
          </View>

          {/* Date Picker */}
          <Text style={styles.label}>Select Event Date:</Text>
          {renderDatePicker()}

          {/* Add More Services Button */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              router.push({
                pathname: "/additionalService",
                params: { selectedServices: JSON.stringify(packages) },
              })
            }
          >
            <Text style={styles.addBtnText}>+ Add More Services</Text>
          </TouchableOpacity>

          {/* Book Button */}
          <TouchableOpacity style={styles.bookBtn} onPress={handleBooking}>
            <Text style={styles.bookBtnText}>Confirm Booking</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noData}>No services selected.</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/additionalService")}
          >
            <Text style={styles.addBtnText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

export default BookCustomizeService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
  },
  backText: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  type: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
  },
  location: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e74c3c",
  },
  totalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e74c3c",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  dateBtn: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  dateBtnText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
  },
  addBtn: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e74c3c",
  },
  addBtnText: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: 15,
  },
  bookBtn: {
    backgroundColor: "#e74c3c",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 40,
    marginBottom: 20,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
});
