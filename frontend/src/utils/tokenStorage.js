import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const TOKEN_KEY = "authToken";

// ✅ Save Token
export const saveToken = async (token) => {
  if (!token) return;

  if (Platform.OS === "web") {
    // Skip storing on web
    console.log("Skipping token storage on web");
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

// ✅ Get Token
export const getToken = async () => {
  if (Platform.OS === "web") {
    console.log("Skipping token retrieval on web");
    return null;
  }

  return await SecureStore.getItemAsync(TOKEN_KEY);
};

// ✅ Remove Token
export const removeToken = async () => {
  if (Platform.OS === "web") {
    console.log("Skipping token removal on web");
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
