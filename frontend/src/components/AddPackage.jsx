import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { usePackageStore } from "../store/packageStore";
import { useVendorAuthStore } from "../store/vendorAuthStore";

const AddPackage = ({ visible, onClose }) => {
  const { createPackage, isCreatingPackage } = usePackageStore();
  const { vendor } = useVendorAuthStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [services, setServices] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true, 
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      const base64Data = result.assets[0].base64;

      handleImageSelectBase64(base64Data || selectedUri);
    }
  };


  const handleImageSelectBase64 = (data) => {
    if (!data) return;

    const base64Image = `data:image/jpeg;base64,${data}`;

    setImage(base64Image); 
  };

  const handleSubmit = () => {
    if (!name || !description || !price || !services || !image) {
      alert("Please fill all fields");
      return;
    }
    const packageData = {
      vendorId:vendor?._id,
      name,
      description,
      price: Number(price),
      services_included: services.split(",").map((s) => s.trim()),
      image,
    };

    createPackage(packageData);

    setName("");
    setDescription("");
    setPrice("");
    setServices("");
    setImage(null);
    onClose();
  };

  if (isCreatingPackage){
    return (<View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Creating Package...</Text>
      </View>
    </View>
  );
  }
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.title}>Add New Package</Text>

              {/* Name */}
              <TextInput
                style={styles.input}
                placeholder="Package Name"
                value={name}
                onChangeText={setName}
              />

              {/* Description */}
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />

              {/* Price */}
              <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />

              {/* Services */}
              <TextInput
                style={styles.input}
                placeholder="Services (comma separated)"
                value={services}
                onChangeText={setServices}
              />

              {/* Image Picker */}
              <Pressable style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <Text style={{ color: "#555" }}>Pick an Image</Text>
                )}
              </Pressable>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.button, styles.cancel]}
                  onPress={onClose}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.submit]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitText}>Submit</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxHeight: "85%",
    padding: 20,
  },
  container: {
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: "#f1f1f1",
  },
  submit: {
    backgroundColor: "#e74c3c",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default AddPackage;
