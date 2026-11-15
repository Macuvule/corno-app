import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs/types";

import {
  SpyIcon,
  HistoryIcon,
  ProfileIcon,
} from "@/components/ui/icons";

const BAR_HEIGHT = 68;
const BAR_PADDING = 6;
const HORIZONTAL_MARGIN = 28;

const ACTIVE_COLOR = "#FFFFFF";
const INACTIVE_COLOR = "rgba(255,255,255,0.5)";

const tabs = [
  { name: "index", label: "Home", Icon: SpyIcon },
  { name: "historico", label: "Histórico", Icon: HistoryIcon },
  { name: "perfil", label: "Perfil", Icon: ProfileIcon },
];

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const barWidth = width - HORIZONTAL_MARGIN * 2;
  const tabWidth = (barWidth - BAR_PADDING * 2) / tabs.length;

  const focusedKey = state.routes[state.index]?.key;
  const activeIndex = Math.max(
    0,
    tabs.findIndex(
      (tab) => state.routes.find((r) => r.name === tab.name)?.key === focusedKey
    )
  );

  const indicatorX = useRef(new Animated.Value(activeIndex * tabWidth)).current;
  const scales = useRef(tabs.map((_, i) => new Animated.Value(i === activeIndex ? 1.08 : 1))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: activeIndex * tabWidth,
        useNativeDriver: true,
        tension: 120,
        friction: 14,
      }),
      ...scales.map((scale, i) =>
        Animated.spring(scale, {
          toValue: i === activeIndex ? 1.08 : 1,
          useNativeDriver: true,
          tension: 160,
          friction: 10,
        })
      ),
    ]).start();
  }, [activeIndex, tabWidth]);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <BlurView
        intensity={40}
        tint="dark"
        style={[styles.bar, { width: barWidth }]}
      >
        {/* Pílula do item ativo */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            { width: tabWidth, transform: [{ translateX: indicatorX }] },
          ]}
        />

        {tabs.map((tab, index) => {
          const route = state.routes.find((r) => r.name === tab.name);
          if (!route) return null;

          const focused = route.key === focusedKey;
          const { options } = descriptors[route.key];
          const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;
          const Icon = tab.Icon;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? tab.label}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              onLongPress={() =>
                navigation.emit({ type: "tabLongPress", target: route.key })
              }
              style={styles.tab}
            >
              <Animated.View style={{ transform: [{ scale: scales[index] }] }}>
                <Icon color={color} size={24} />
              </Animated.View>
              <Text
                style={[
                  styles.label,
                  { color, fontWeight: focused ? "700" : "500" },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    padding: BAR_PADDING,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(18,18,18,0.6)", // fallback quando o blur não renderiza (Android)
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.18)",
  },
  indicator: {
    position: "absolute",
    top: BAR_PADDING,
    left: BAR_PADDING,
    height: BAR_HEIGHT - BAR_PADDING * 2,
    borderRadius: (BAR_HEIGHT - BAR_PADDING * 2) / 2,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  tab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
