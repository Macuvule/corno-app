import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { TEXT_MUTED } from "@/constants/theme";

type Props = { count: number };

export default function HistoryHeader({ count }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <Text style={styles.subtitle}>
        {count} {count === 1 ? "teste realizado" : "testes realizados"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_MUTED,
  },
});
