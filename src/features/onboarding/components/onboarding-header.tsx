import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { SpyIcon } from "@/components/ui/icons";
import { AlertIcon } from "@/components/ui/icons";

type Props = {
  title: string;
};

export default function OnboardingHeader({ title }: Props) {
  return (
    <View style={styles.container}>
      

      <View style={styles.badge}>
        <SpyIcon size={56} />
      </View>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 18,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(245,181,68,0.12)",
    borderWidth: 1,
    borderColor: "#7BE8A8",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
