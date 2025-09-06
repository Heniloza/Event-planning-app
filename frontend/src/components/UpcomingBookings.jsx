import { View, Text, StyleSheet, Image, Platform } from "react-native";
import React from "react";

const UpcomingBookings = () => {
  const upcomingBooking = false;

  return (
    <View style={styles.container}>
      {upcomingBooking ? (
        <Text style={styles.heading}>Upcoming Bookings</Text>
      ) : ( 
        <View style={styles.emptyState}>
          <Image
            source={ require("../assets/no-booking.png") 
            }
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.message}>No upcoming bookings yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "gray",
  },
});

export default UpcomingBookings;
