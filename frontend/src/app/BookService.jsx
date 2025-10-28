import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";  
import Toast from 'react-native-toast-message';
import { usePackageStore } from "../store/packageStore";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookService() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const { generateBundles, fetchAllPackages, filterPackages , setUserInputs } =
    usePackageStore();
  const navigation = useNavigation();
  const [eventDate, setEventDate] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [venueGuestCount, setVenueGuestCount] = useState("");
  const [venueBudget, setVenueBudget] = useState("");
  const [decorBudget, setDecorBudget] = useState("");
  const [catererGuestCount, setCatererGuestCount] = useState("");
  const [catererBudget, setCatererBudget] = useState("");
  const [meals, setMeals] = useState([]);
  const [theme, setTheme] = useState("");

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const toggleMeal = (meal) => {
    setMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedServices.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please select at least one service to proceed.',
      })
      return;
    }
    setStep(step + 1);
  };

const handleSubmit = () => {
  if (!eventDate) {
    Toast.show({
      type: "error",
      text1: "Please select an event date",
    });
    return;
  }

   if (selectedServices.includes("Venue")) {
     if (!venueGuestCount.trim()) {
       Toast.show({
         type: "error",
         text1: "Please enter guest count for Venue",
       });
       return;
     }
     if (!venueBudget.trim()) {
       Toast.show({ type: "error", text1: "Please enter budget for Venue" });
       return;
     }
   }

   if (selectedServices.includes("Decorator")) {
     if (!decorBudget.trim()) {
       Toast.show({
         type: "error",
         text1: "Please enter budget for Decorator",
       });
       return;
     }
     if (!theme) {
       Toast.show({
         type: "error",
         text1: "Please select a theme for Decorator",
       });
       return;
     }
   }

   if (selectedServices.includes("Caterer")) {
     if (!catererGuestCount.trim()) {
       Toast.show({
         type: "error",
         text1: "Please enter guest count for Caterer",
       });
       return;
     }
     if (!catererBudget.trim()) {
       Toast.show({ type: "error", text1: "Please enter budget for Caterer" });
       return;
     }
     if (meals.length === 0) {
       Toast.show({ type: "error", text1: "Please select at least one meal" });
       return;
     }
   }

  const data = {
    selectedServices,
    eventDate,
    venue: {
      guestCount: Number(venueGuestCount) || 0,
      budget: Number(venueBudget) || 0,
    },
    decorator: { budget: Number(decorBudget) || 0, theme: theme || null },
    caterer: {
      guestCount: Number(catererGuestCount) || 0,
      budget: Number(catererBudget) || 0,
      meals,
    },
  };

  console.log("Final Data:", data);
  setUserInputs(data);

  generateBundles(selectedServices, {
    venueBudget: data.venue.budget,
    decorBudget: data.decorator.budget,
    catererBudget: data.caterer.budget,
  });

  navigation.navigate("packageResults");
};

  useEffect(() => {
    fetchAllPackages();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }} // <-- extra space at bottom
      >
        {step === 1 && (
          <>
            <Text style={styles.title}>Select Services</Text>
            {["Venue", "Decorator", "Caterer"].map((service) => (
              <TouchableOpacity
                key={service}
                style={[
                  styles.option,
                  selectedServices.includes(service) && styles.selected,
                ]}
                onPress={() => toggleService(service)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedServices.includes(service) && { color: "#fff" },
                  ]}
                >
                  {service}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            {selectedServices.includes("Venue") && (
              <>
                <Text style={styles.label}>Guest Count (Venue)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={venueGuestCount}
                  onChangeText={setVenueGuestCount}
                />
                <Text style={styles.label}>Budget (Venue)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={venueBudget}
                  onChangeText={setVenueBudget}
                />
              </>
            )}

            {selectedServices.includes("Decorator") && (
              <>
                <Text style={styles.label}>Budget (Decor)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={decorBudget}
                  onChangeText={setDecorBudget}
                />

                <Text style={styles.label}>Select Theme</Text>
                {[
                  "Birthday Decor",
                  "Wedding Decor",
                  "Corporate Event",
                  "House Decor",
                  "Social Event Decor",
                ].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.option, theme === t && styles.selected]}
                    onPress={() => setTheme(t)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        theme === t && { color: "#fff" },
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {selectedServices.includes("Caterer") && (
              <>
                <Text style={styles.label}>Guest Count (Caterers)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={catererGuestCount}
                  onChangeText={setCatererGuestCount}
                />
                <Text style={styles.label}>Budget (Caterers)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={catererBudget}
                  onChangeText={setCatererBudget}
                />

                <Text style={styles.label}>Meals</Text>
                {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                  <TouchableOpacity
                    key={meal}
                    style={[
                      styles.option,
                      meals.includes(meal) && styles.selected,
                    ]}
                    onPress={() => toggleMeal(meal)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        meals.includes(meal) && { color: "#fff" },
                      ]}
                    >
                      {meal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {Platform.OS === "!web" && (
              <>
                <Text style={styles.label}>Select Event Date</Text>
                <TouchableOpacity
                  style={styles.dateBtn}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {eventDate
                      ? format(eventDate, "dd MMM yyyy")
                      : "Choose Date"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {Platform.OS === "web" ? (
              <TextInput
                style={{
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  backgroundColor: "#fff",
                }}
                placeholder="Select Date"
                value={eventDate ? format(eventDate, "yyyy-MM-dd") : ""}
                onFocus={(e) => {
                  // simple fallback: open native date picker dialog if needed
                  e.target.type = "date";
                }}
                onChangeText={(val) => setEventDate(new Date(val))}
              />
            ) : (
              <>
                <Text style={styles.label}>Select Event Date</Text>
                <TouchableOpacity
                  style={styles.dateBtn}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {eventDate
                      ? format(eventDate, "dd MMM yyyy")
                      : "Choose Date"}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={eventDate || new Date()}
                    mode="date"
                    display="calendar"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setEventDate(selectedDate);
                    }}
                  />
                )}
              </>
            )}

            <TouchableOpacity style={styles.nextBtn} onPress={handleSubmit}>
              <Text style={styles.nextText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F5F5" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10, color: "#333" },
  option: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selected: { backgroundColor: "#4A628A", borderColor: "#4A628A" },
  optionText: { fontSize: 16, color: "#333" },
  label: { fontSize: 16, fontWeight: "600", marginTop: 15, marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  nextBtn: {
    backgroundColor: "#5F8D4E",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  dateBtn: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
