import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker"; 
import { useVendorAuthStore } from "../store/vendorAuthStore";

const UpdateProfile = () => {
  const navigation = useNavigation();
  const { vendor, updateVendor } = useVendorAuthStore();

  
  const [form, setForm] = useState({
    business_name: vendor?.business_name || "",
    owner_name: vendor?.owner_name || "",
    description: vendor?.description || "",
    email: vendor?.email || "",
    phone: vendor?.phone || "",
    category: vendor?.category || "All",
    location: vendor?.location || "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = () => {
    console.log("Updated data:", form);
    updateVendor(form,vendor?._id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>

      {/* Scrollable form */}
      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={form.business_name}
          onChangeText={(text) => handleChange("business_name", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          value={form.owner_name}
          onChangeText={(text) => handleChange("owner_name", text)}
        />

        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Description"
          value={form.description}
          onChangeText={(text) => handleChange("description", text)}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.category}
            onValueChange={(value) => handleChange("category", value)}
            style={styles.picker}
          >
            <Picker.Item label="Caterer" value="Caterer" />
            <Picker.Item label="Decorator" value="Decorator" />
            <Picker.Item label="Venue" value="Venue" />
            <Picker.Item label="All" value="All" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={form.location}
          onChangeText={(text) => handleChange("location", text)}
        />

      
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  picker: {
    width: "100%",
  },
  updateButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
