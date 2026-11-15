import React, { useState } from "react";
import { Image, LayoutChangeEvent, StyleSheet, Text, View } from "react-native";

import ActionButton from "./action-button";
import { Verdict } from "./content";
import {
  GLASS_BG,
  GLASS_BORDER,
  MINT,
  MINT_BORDER,
  TEXT_MUTED,
} from "@/constants/theme";

import GlowBorder from "./glow-border";

type Props = {
  photoUri: string;
  verdict: Verdict;
  onReset: () => void;
};

const RADIUS = 24;
const PHOTO = 170;

export default function VerdictCard({ photoUri, verdict, onReset }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoRing}>
        <Image source={{ uri: photoUri }} style={styles.photo} />
      </View>

      <View style={styles.scoreBlock}>
        <Text style={styles.label}>Risco de cornos</Text>
        <Text style={styles.risk}>{verdict.risk}%</Text>
        <Text style={styles.title}>{verdict.title}</Text>
      </View>

      {/* O GlowBorder fica DENTRO do card, que é o que é medido */}
      <View style={styles.card} onLayout={handleLayout}>
        <Text style={styles.message}>{verdict.message}</Text>

        <GlowBorder
          width={size.width}
          height={size.height}
          radius={RADIUS}
          baseColor={GLASS_BORDER}
        />
      </View>

      <ActionButton label="Novo teste" onPress={onReset} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 20,
  },
  photoRing: {
    width: PHOTO + 12,
    height: PHOTO + 12,
    borderRadius: (PHOTO + 12) / 2,
    borderWidth: 1.6,
    borderColor: "#7BE8A8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: MINT,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: PHOTO / 2,
    backgroundColor: "#111111",
  },
  scoreBlock: { alignItems: "center", gap: 2 },
  label: { fontSize: 14, color: TEXT_MUTED },
  risk: {
    fontSize: 64,
    fontWeight: "700",
    color: MINT,
    fontVariant: ["tabular-nums"],
  },
  title: { fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  card: {
    alignSelf: "stretch",
    padding: 20,
    borderRadius: RADIUS,
    backgroundColor: GLASS_BG,
    overflow: "hidden",
    // sem borderWidth: a borda é desenhada pelo GlowBorder
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
  },
  button: { alignSelf: "stretch" },
});
