import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { SpyIcon } from "@/components/ui/icons";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <SpyIcon size={30} />
      <Text style={styles.title}>CornoCheck</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: "#FFFFFF",
  },
});
