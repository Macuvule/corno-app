import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { GLASS_BG, GLASS_BORDER, MINT } from "@/constants/theme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
};

export default function ActionButton({
  label,
  onPress,
  variant = "primary",
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      tension: 200,
      friction: 12,
    }).start();

  const content =
    variant === "primary" ? (
      <LinearGradient
        colors={["#F4FFF0", MINT]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={[styles.label, styles.labelPrimary]}>{label}</Text>
      </LinearGradient>
    ) : (
      <Animated.View style={[styles.button, styles.secondary]}>
        <Text style={[styles.label, styles.labelSecondary]}>{label}</Text>
      </Animated.View>
    );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }] }}>{content}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: {
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  labelPrimary: { color: "#000000" },
  labelSecondary: { color: "#FFFFFF" },
});
