// src/app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // On first launch → go to Splash
  return <Redirect href="/(auth)/splash" />;
}
