import React from "react";
import { StyleSheet, Text, View } from "react-native";

import PhotoRing from "@/components/ui/photo-ring";
import { GLASS_BG, GLASS_BORDER, TEXT_MUTED } from "@/constants/theme";

import { HistoryEntry } from "./history-data";
import RiskBadge from "./risk-badge";

type Props = { entry: HistoryEntry };

export default function HistoryItem({ entry }: Props) {
  return (
    <View style={styles.card}>
      <PhotoRing
        name={entry.name}
        source={entry.photo}
        size={56}
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {entry.name}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {entry.title}
        </Text>
        <Text style={styles.message} numberOfLines={3}>
          {entry.message}
        </Text>
        <Text style={styles.date}>{entry.date}</Text>
      </View>

      <RiskBadge risk={entry.risk} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 14,
    borderRadius: 24,
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
  message: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: TEXT_MUTED,
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
});
