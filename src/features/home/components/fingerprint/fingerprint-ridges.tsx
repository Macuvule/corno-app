import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

import { MINT } from "@/constants/theme";
import { HEIGHT, STROKE, WIDTH, fingerShape } from "./finger-shape";

type Props = {
  color?: string;
  strokeWidth?: number;
};

const FIRST_INSET = STROKE / 2 + 7; // folga entre o contorno e a 1ª crista
const RIDGE_GAP = 6.5; // distância entre cristas
const MIN_WIDTH = 8; // para quando o miolo fica demasiado estreito

// Cada crista é o contorno do dedo, encolhido um pouco mais.
const RIDGES: { d: string; length: number }[] = [];
for (let inset = FIRST_INSET; WIDTH - 2 * inset >= MIN_WIDTH; inset += RIDGE_GAP) {
  RIDGES.push(fingerShape(inset));
}

/**
 * Impressão digital desenhada com o formato exato da área do dedo:
 * cristas concêntricas, com pequenas falhas em sítios diferentes
 * para parecer uma impressão real.
 */
export default function FingerprintRidges({
  color = MINT,
  strokeWidth = 1.5,
}: Props) {
  return (
    <Svg width={WIDTH} height={HEIGHT} style={styles.svg} pointerEvents="none">
      {RIDGES.map((ridge, i) => {
        const isCore = i === RIDGES.length - 1;
        const L = ridge.length;

        return (
          <Path
            key={i}
            d={ridge.d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity={0.9}
            strokeLinecap="round"
            // Duas falhas por crista, deslocadas de crista para crista
            strokeDasharray={
              isCore ? undefined : `${L * 0.44} ${L * 0.05} ${L * 0.44} ${L * 0.07}`
            }
            strokeDashoffset={isCore ? undefined : L * ((i * 0.23) % 1)}
          />
        );
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  svg: { position: "absolute" },
});
