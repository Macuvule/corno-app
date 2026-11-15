import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { riskColor } from "./risk";

type Props = { risk: number };

export default function RiskBadge({ risk }: Props) {
  const color = riskColor(risk);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${color}22`, borderColor: `${color}55` },
      ]}
    >
      <Text style={[styles.text, { color }]}>{risk}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
