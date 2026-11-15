import React from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCornoCheck } from "@/lib/hooks/use-corno-check";
import HomeHeader from "./components/home-header";
import FingerprintScanner from "./components/fingerprint/fingerprint-scanner";
import SelfieCamera from "./components/selfie-camera";
import PhotoConfirm from "./components/photo-confirm";
import VerdictCard from "./components/verdict-card";

// Altura do tabBar flutuante + folga
const TAB_BAR_SPACE = 68 + 12 + 16;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const check = useCornoCheck();

  const showResult =
    check.phase === "result" && check.photoUri && check.verdict;
  const modalVisible = check.phase === "camera" || check.phase === "preview";

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + TAB_BAR_SPACE,
        },
      ]}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <HomeHeader />
      </View>

      {showResult ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultContent}
        >
          <VerdictCard
            photoUri={check.photoUri!}
            verdict={check.verdict!}
            onReset={check.reset}
          />
        </ScrollView>
      ) : (
        <View style={styles.center}>
            <FingerprintScanner
                scanning={check.phase === "scanning"}
                aborted={check.aborted}
                onHoldStart={check.startScan}
                onHoldEnd={check.abortScan}
                onComplete={check.finishScan}
            />
        </View>
      )}

      {/* Ecrã inteiro: cobre também o tabBar */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={check.cancel}
      >
        {check.phase === "preview" && check.photoUri ? (
          <PhotoConfirm
            uri={check.photoUri}
            onConfirm={check.confirm}
            onRetake={check.retake}
          />
        ) : (
          <SelfieCamera onCapture={check.takePhoto} onCancel={check.cancel} />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 24,
  },
  header: { paddingBottom: 8 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  resultContent: {
    paddingTop: 24,
    paddingBottom: 16,
  },
});
