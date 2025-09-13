import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { usePackageStore } from "../store/packageStore";

const PackageResults = () => {
  const { generatedPackages } = usePackageStore();

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
    <ScrollView>
      {generatedPackages.map((bundle, index) => (
        <View key={bundle.id || bundle._id || index} style={styles.card}>
          {bundle.services ? (
            <>
              <Text>Total Price: {bundle.totalPrice}</Text>
              <Text>Venue: {bundle.services.venue?.name}</Text>
              <Text>Decor: {bundle.services.decor?.name}</Text>
              <Text>Caterer: {bundle.services.caterer?.name}</Text>
            </>
          ) : (
            <>
              <Text>Package: {bundle.name}</Text>
              <Text>Price: {bundle.price}</Text>
              <Text>
                Services:{" "}
                {Array.isArray(bundle.services_included)
                  ? bundle.services_included.join(", ")
                  : "N/A"}
              </Text>
            </>
          )}

          <TouchableOpacity style={styles.bookBtn}>
            <Text style={{ color: "#fff" }}>Book Now</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  bookBtn: {
    marginTop: 10,
    backgroundColor: "#4A628A",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: "#555" },
});

export default PackageResults;
