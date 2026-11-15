import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { SpyIcon } from "@/components/ui/icons";

type Props = {
  onComplete: () => void;
};

const LOGO_SIZE = 64;
const GAP = 14;

export function Splash_Screen({ onComplete }: Props) {
  const [textWidth, setTextWidth] = useState(0);
  const started = useRef(false);

  // Entrada do ícone
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  // Deslocamento do ícone (começa centralizado sozinho, depois vai pra esquerda)
  const logoShift = useRef(new Animated.Value(0)).current;

  // Wordmark
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textShift = useRef(new Animated.Value(-12)).current;
  const textScale = useRef(new Animated.Value(0.85)).current;

  // Saída
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const exitScale = useRef(new Animated.Value(1)).current;
  const blurOpacity = useRef(new Animated.Value(0)).current;

  const handleTextLayout = (e: LayoutChangeEvent) => {
    const w = Math.ceil(e.nativeEvent.layout.width);
    if (w > 0 && w !== textWidth) setTextWidth(w);
  };

  useEffect(() => {
    if (!textWidth || started.current) return;
    started.current = true;

    // Ícone sozinho no centro: desloca metade da largura do texto + gap
    logoShift.setValue((textWidth + GAP) / 2);

    const animation = Animated.sequence([
      // 1. Ícone aparece
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(250),

      // 2. Ícone vai pra esquerda e "CornoCheck" surge
      Animated.parallel([
        Animated.timing(logoShift, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          delay: 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textShift, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Texto cresce um pouco e depois volta ao tamanho normal
        Animated.sequence([
          Animated.timing(textScale, {
            toValue: 1.12,
            duration: 400,
            delay: 100,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(textScale, {
            toValue: 1,
            duration: 300,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.delay(900),

      // 3. Saída: desfoca e some
      Animated.parallel([
        Animated.timing(blurOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(exitOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(exitScale, {
          toValue: 1.08,
          duration: 500,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(({ finished }) => {
      if (finished) onComplete();
    });

    return () => animation.stop();
  }, [textWidth]);

  return (
    <View
      style={styles.container}
      // Quando este splash já está na tela, some o splash nativo
      onLayout={() => {
        SplashScreen.hideAsync().catch(() => {});
      }}
    >
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.row,
          { opacity: exitOpacity, transform: [{ scale: exitScale }] },
        ]}
      >
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ translateX: logoShift }, { scale: logoScale }],
          }}
        >
          <SpyIcon size={LOGO_SIZE} />
        </Animated.View>

        <Animated.Text
          onLayout={handleTextLayout}
          style={[
            styles.title,
            {
              opacity: textOpacity,
              // Cresce a partir da esquerda, para não encostar no ícone
              transformOrigin: "left center",
              transform: [{ translateX: textShift }, { scale: textScale }],
            },
          ]}
        >
          CornoCheck
        </Animated.Text>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}
      >
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

export default Splash_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: GAP,
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },
});
