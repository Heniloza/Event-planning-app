import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../store/authStore";

export default function Layout() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
      <Toast />
    </>
  );
}
