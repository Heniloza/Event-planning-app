import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";

export default function BookService({ navigation }) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [guestCount, setGuestCount] = useState("");
  const [budget, setBudget] = useState("");
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
      alert("Please select at least one service");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    const data = { selectedServices, guestCount, budget, meals, theme };
    console.log("Final Data:", data);
    alert("Service request submitted!");
  };

  return (
    <ScrollView style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Select Services</Text>
          {["Venues", "Decor", "Caterers"].map((service) => (
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
          {selectedServices.includes("Venues") && (
            <>
              <Text style={styles.label}>Guest Count (Venue)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={guestCount}
                onChangeText={setGuestCount}
              />
              <Text style={styles.label}>Budget (Venue)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={budget}
                onChangeText={setBudget}
              />
            </>
          )}

          {selectedServices.includes("Decor") && (
            <>
              <Text style={styles.label}>Budget (Decor)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={budget}
                onChangeText={setBudget}
              />

              <Text style={styles.label}>Select Theme</Text>
              {["Birthday Decor", "Wedding Decor", "Corporate Event", "House decor" ,"Social Event Decor"].map((t) => (
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

          {selectedServices.includes("Caterers") && (
            <>
              <Text style={styles.label}>Guest Count (Caterers)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={guestCount}
                onChangeText={setGuestCount}
              />
              <Text style={styles.label}>Budget (Caterers)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={budget}
                onChangeText={setBudget}
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

          <TouchableOpacity style={styles.nextBtn} onPress={handleSubmit}>
            <Text style={styles.nextText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
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
});
