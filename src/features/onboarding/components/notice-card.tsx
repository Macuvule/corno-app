import React, { useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import GlowBorder from "./glow-border";

const RADIUS = 24;

type Props = {
  paragraphs: string[];
};

export default function NoticeCard({ paragraphs }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  };

  return (
    <View style={styles.card} onLayout={handleLayout}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        bounces={false}
      >
        {paragraphs.map((text, index) => (
          <Text key={index} style={styles.paragraph}>
            {text}
          </Text>
        ))}
      </ScrollView>

      <GlowBorder
        width={size.width}
        height={size.height}
        radius={RADIUS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexShrink: 1,
    borderRadius: RADIUS,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  content: {
    padding: 22,
    gap: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255,255,255,0.78)",
  },
});
