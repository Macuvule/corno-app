import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type Props = {
  width: number;
  height: number;
  radius?: number;
  /** Cor do núcleo do feixe */
  color?: string;
  /** Cor do halo que "ilumina" o vidro */
  glowColor?: string;
  baseColor?: string;
  /** Tempo de uma volta completa, em ms */
  duration?: number;
};

const CORE_WIDTH = 1.8;
const GLOW_WIDTH = 10;

/**
 * Perfil do feixe: várias camadas CENTRADAS no mesmo ponto, cada uma um pouco
 * mais longa que a anterior. Onde se sobrepõem fica mais intenso, então o
 * brilho é máximo no centro e esmorece suavemente para os dois lados
 * (sem cabeça nem cauda, como um feixe de luz a passar).
 */
const CORE_LAYERS = 6;
const CORE_OPACITY = 0.2;
const GLOW_LAYERS = 8;
const GLOW_OPACITY = 0.05;

export default function GlowBorder({
  width,
  height,
  radius = 24,
  color = "#E4FFEE",
  glowColor = "#7BE8A8",
  baseColor = "rgba(255,255,255,0.12)",
  duration = 5000,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  const inset = CORE_WIDTH / 2;
  const w = Math.max(width - CORE_WIDTH, 0);
  const h = Math.max(height - CORE_WIDTH, 0);
  const r = Math.max(radius - inset, 0);

  // Perímetro de um retângulo arredondado
  const perimeter = useMemo(
    () => 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r,
    [w, h, r]
  );
  const beamLength = Math.min(perimeter * 0.2, 120);

  useEffect(() => {
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: false, // strokeDashoffset não corre no driver nativo
      })
    );
    loop.start();
    return () => loop.stop();
  }, [duration]);

  if (width <= 0 || height <= 0) return null;

  const renderLayer = (
    key: string,
    len: number,
    stroke: string,
    strokeWidth: number,
    opacity: number
  ) => {
    // Camada centrada no ponto `progress * perímetro`
    const dashOffset = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [len / 2, len / 2 - perimeter],
    });

    return (
      <AnimatedRect
        key={key}
        x={inset}
        y={inset}
        width={w}
        height={h}
        rx={r}
        ry={r}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeDasharray={`${len} ${perimeter - len}`}
        strokeDashoffset={dashOffset}
      />
    );
  };

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {/* Borda base */}
      <Rect
        x={inset}
        y={inset}
        width={w}
        height={h}
        rx={r}
        ry={r}
        fill="none"
        stroke={baseColor}
        strokeWidth={1}
      />

      {/* Halo: espalha luz para dentro do cartão */}
      {Array.from({ length: GLOW_LAYERS }, (_, i) =>
        renderLayer(
          `glow-${i}`,
          (beamLength * (i + 1)) / GLOW_LAYERS,
          glowColor,
          GLOW_WIDTH,
          GLOW_OPACITY
        )
      )}

      {/* Núcleo do feixe */}
      {Array.from({ length: CORE_LAYERS }, (_, i) =>
        renderLayer(
          `core-${i}`,
          (beamLength * (i + 1)) / CORE_LAYERS,
          color,
          CORE_WIDTH,
          CORE_OPACITY
        )
      )}
    </Svg>
  );
}
