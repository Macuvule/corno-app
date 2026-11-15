import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#f8fbea" } }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}