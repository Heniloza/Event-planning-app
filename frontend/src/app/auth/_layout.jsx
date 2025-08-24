import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="userLogin" />
      <Stack.Screen name="userSignup" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="roleSelection" />
      <Stack.Screen name="vendorSignup" />
      <Stack.Screen name="vendorLogin" />
    </Stack>
  );
}
