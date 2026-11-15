import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { MINT, MINT_BORDER } from "@/constants/theme";

type Props = {
  /** URL remota ou resultado de require("...") */
  source?: { uri: string } | number;
  /** Nome, usado para as iniciais quando não há imagem */
  name: string;
  /** Diâmetro da foto (o anel fica à volta) */
  size?: number;
  ringColor?: string;
  glowColor?: string;
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * Foto redonda com anel luminoso (o mesmo estilo do veredicto da Home).
 * Se a imagem falhar ou não existir, mostra as iniciais.
 */
export default function PhotoRing({
  source,
  name,
  size = 64,
  ringColor = MINT_BORDER,
  glowColor = MINT,
}: Props) {
  const [failed, setFailed] = useState(false);
  const pad = Math.max(5, Math.round(size * 0.07));
  const outer = size + pad * 2;
  const showImage = !!source && !failed;

  return (
    <View
      style={[
        styles.ring,
        {
          width: outer,
          height: outer,
          borderRadius: outer / 2,
          borderColor: ringColor,
          shadowColor: glowColor,
        },
      ]}
    >
      {showImage ? (
        <Image
          source={source}
          onError={() => setFailed(true)}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#111111",
          }}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
            {initialsOf(name)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  fallback: {
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "700",
    color: MINT,
  },
});
