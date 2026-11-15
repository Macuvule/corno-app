import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { SCAN_STEPS } from "./content";
import { MINT, TEXT_MUTED } from "@/constants/theme";

type Props = {
  scanning: boolean;
  percent: number;
  /** true quando o utilizador largou o dedo antes de a análise terminar */
  aborted?: boolean;
};

export default function ScanStatus({
  scanning,
  percent,
  aborted = false,
}: Props) {
  if (!scanning) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Coloca o dedo no scanner</Text>
        <Text style={[styles.subtitle, aborted && styles.warning]}>
          {aborted
            ? "Análise interrompida. Mantém o dedo até ao fim."
            : "Mantém o dedo premido para iniciar"}
        </Text>
      </View>
    );
  }

  const step = SCAN_STEPS.find((s) => percent < s.until) ?? SCAN_STEPS[3];

  return (
    <View style={styles.container}>
      <Text style={styles.percent}>{percent}%</Text>
      <Text style={styles.subtitle}>{step.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 6,
    marginTop: 32,
    minHeight: 72,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  percent: {
    fontSize: 40,
    fontWeight: "700",
    color: MINT,
    fontVariant: ["tabular-nums"],
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_MUTED,
    textAlign: "center",
  },
  warning: {
    color: "#F5B544",
  },
});
