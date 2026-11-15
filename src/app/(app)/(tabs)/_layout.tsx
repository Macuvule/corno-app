import React from "react";
import { Redirect, Tabs } from "expo-router";

import { useIsFirstTime } from "@/lib/hooks/use-is-first-time";

import CustomTabBar from "@/components/navigation/customTabBar";

export default function TabLayout() {
  const [isFirstTime] = useIsFirstTime();

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: "#f8fbea" }}}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="historico" options={{ title: "Historico" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
  );
}