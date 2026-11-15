import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FadeIn from "./components/fade-in";
import OnboardingHeader from "./components/onboarding-header";
import NoticeCard from "./components/notice-card";
import ContinueButton from "./components/continue-button";
import {
  CONTINUE_LABEL,
  NOTICE_PARAGRAPHS,
  NOTICE_TITLE,
} from "./components/content";

type props = {
  onNext: () => void;
};

export default function OnboardingScreen({onNext}:props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 32,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
        },
      ]}
    >
      <StatusBar style="light" />

      <FadeIn delay={100}>
        <OnboardingHeader title={NOTICE_TITLE} />
      </FadeIn>

      <FadeIn delay={300} style={styles.cardWrapper}>
        <NoticeCard paragraphs={NOTICE_PARAGRAPHS} />
      </FadeIn>

      <FadeIn delay={500}>
        <ContinueButton label={CONTINUE_LABEL} onPress={onNext} />
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 24,
    gap: 28,
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
});
