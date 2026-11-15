import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import ScanStatus from "../scan-status";
import { MINT, MINT_SOFT } from "@/constants/theme";
import FingerprintRidges from "./fingerprint-ridges"

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Formato de ponta de dedo: topo em cúpula, base com cantos suavizados
const WIDTH = 96;
const HEIGHT = 132;
const BOTTOM_RADIUS = 24;
const STROKE = 3;
const ICON_SIZE = 66;
const SCAN_DURATION = 3600;

// --- Geometria do contorno (começa no topo, segue no sentido horário) ---
const INSET = STROKE / 2;
const CX = WIDTH / 2;
const TOP_R = (WIDTH - STROKE) / 2;
const X0 = INSET;
const X1 = WIDTH - INSET;
const Y_BOTTOM = HEIGHT - INSET;
const Y_ARC_END = INSET + TOP_R; // onde a cúpula termina e começam as laterais

const FINGER_PATH = [
  `M ${CX} ${INSET}`,
  `A ${TOP_R} ${TOP_R} 0 0 1 ${X1} ${Y_ARC_END}`,
  `L ${X1} ${Y_BOTTOM - BOTTOM_RADIUS}`,
  `A ${BOTTOM_RADIUS} ${BOTTOM_RADIUS} 0 0 1 ${X1 - BOTTOM_RADIUS} ${Y_BOTTOM}`,
  `L ${X0 + BOTTOM_RADIUS} ${Y_BOTTOM}`,
  `A ${BOTTOM_RADIUS} ${BOTTOM_RADIUS} 0 0 1 ${X0} ${Y_BOTTOM - BOTTOM_RADIUS}`,
  `L ${X0} ${Y_ARC_END}`,
  `A ${TOP_R} ${TOP_R} 0 0 1 ${CX} ${INSET}`,
  "Z",
].join(" ");

const PATH_LENGTH =
  Math.PI * TOP_R + // cúpula
  2 * (Y_BOTTOM - BOTTOM_RADIUS - Y_ARC_END) + // laterais
  Math.PI * BOTTOM_RADIUS + // dois cantos inferiores
  (X1 - X0 - 2 * BOTTOM_RADIUS); // base reta

// Cantos arredondados de uma View com o mesmo formato (para glow e recorte)
const shapeStyle = (w: number, h: number) => ({
  width: w,
  height: h,
  borderTopLeftRadius: w / 2,
  borderTopRightRadius: w / 2,
  borderBottomLeftRadius: BOTTOM_RADIUS,
  borderBottomRightRadius: BOTTOM_RADIUS,
});

type Props = {
  scanning: boolean;
  /** true quando o utilizador largou o dedo antes de terminar */
  aborted?: boolean;
  /** Dedo pousado no scanner */
  onHoldStart: () => void;
  /** Dedo levantado (se a análise ainda não acabou, deve abortar) */
  onHoldEnd: () => void;
  onComplete: () => void;
};

export default function FingerprintScanner({
  scanning,
  aborted = false,
  onHoldStart,
  onHoldEnd,
  onComplete,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const scanLine = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  // Pulso suave enquanto espera o toque
  useEffect(() => {
    if (scanning) return;
    pulse.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanning]);

  // Análise: contorno de progresso + linha de varrimento
  useEffect(() => {
    if (!scanning) {
      // Abortou (ou terminou): o anel recua em vez de saltar para 0
      Animated.timing(progress, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
      setPercent(0);
      return;
    }

    // Nova tentativa: começa sempre do zero
    progress.stopAnimation();
    progress.setValue(0);

    const listenerId = progress.addListener(({ value }) =>
      setPercent(Math.round(value * 100))
    );

    const sweep = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    sweep.start();

    const run = Animated.timing(progress, {
      toValue: 1,
      duration: SCAN_DURATION,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false, // strokeDashoffset não corre no driver nativo
    });
    run.start(({ finished }) => {
      if (finished) onComplete();
    });

    return () => {
      progress.removeListener(listenerId);
      sweep.stop();
      run.stop();
    };
  }, [scanning]);

  const dashOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [PATH_LENGTH, 0],
  });

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPressIn={onHoldStart}
        onPressOut={onHoldEnd}
        // Se o dedo sair da área, conta como largar
        pressRetentionOffset={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Scanner de impressão digital"
        accessibilityHint="Mantém premido até a análise terminar"
      >
        <View style={styles.scanner}>
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
                transform: [
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.07],
                    }),
                  },
                ],
              },
            ]}
          />

          <Svg width={WIDTH} height={HEIGHT} style={styles.outline}>
            {/* Contorno base */}
            <Path
              d={FINGER_PATH}
              stroke="rgba(155,240,194,0.15)"
              strokeWidth={STROKE}
              fill="none"
            />
            {/* Progresso */}
            <AnimatedPath
              d={FINGER_PATH}
              stroke={MINT}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
              strokeDashoffset={dashOffset}
            />
          </Svg>
           <FingerprintRidges />

          {scanning && (
            <View style={styles.clip} pointerEvents="none">
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanLine.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, HEIGHT - 20],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          )}
        </View>
      </Pressable>

      <ScanStatus scanning={scanning} percent={percent} aborted={aborted} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  scanner: {
    width: WIDTH,
    height: HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    ...shapeStyle(WIDTH - 14, HEIGHT - 14),
    backgroundColor: MINT_SOFT,
  },
  outline: {
    position: "absolute",
  },
  clip: {
    position: "absolute",
    top: 0,
    left: 0,
    ...shapeStyle(WIDTH, HEIGHT),
    overflow: "hidden",
  },
  scanLine: {
    height: 2,
    marginHorizontal: 14,
    borderRadius: 1,
    backgroundColor: MINT,
    shadowColor: MINT,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
