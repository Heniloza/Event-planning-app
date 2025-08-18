import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="oauth" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="role-selection" />
    </Stack>
  );
}
