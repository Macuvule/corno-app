import React, { useRef, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ActionButton from "./action-button";
import { MINT, MINT_BORDER, TEXT_MUTED } from "@/constants/theme";

type Props = {
  onCapture: (uri: string) => void;
  onCancel: () => void;
};

export default function SelfieCamera({ onCapture, onCancel }: Props) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);

  const takePicture = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) onCapture(photo.uri);
    } finally {
      setBusy(false);
    }
  };

  // A carregar o estado da permissão
  if (!permission) return <View style={styles.container} />;

  // Sem permissão
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permission]}>
        <Text style={styles.permissionTitle}>Precisamos da câmara</Text>
        <Text style={styles.permissionText}>
          Para tirares a selfie e personalizares o resultado.
        </Text>
        <ActionButton
          label={permission.canAskAgain ? "Permitir câmara" : "Abrir definições"}
          onPress={() =>
            permission.canAskAgain ? requestPermission() : Linking.openSettings()
          }
          style={styles.permissionButton}
        />
        <Pressable onPress={onCancel} hitSlop={12}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" mirror />

      <Pressable
        onPress={onCancel}
        hitSlop={12}
        accessibilityLabel="Fechar câmara"
        style={[styles.close, { top: insets.top + 12 }]}
      >
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <View style={styles.guideWrapper} pointerEvents="none">
        <View style={styles.guide} />
        <Text style={styles.hint}>Enquadra o teu rosto</Text>
      </View>

      <View style={[styles.shutterWrapper, { bottom: insets.bottom + 32 }]}>
        <Pressable
          onPress={takePicture}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Tirar selfie"
          style={styles.shutterOuter}
        >
          <View style={[styles.shutterInner, busy && { opacity: 0.5 }]} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  permission: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  permissionTitle: { fontSize: 24, fontWeight: "700", color: "#FFFFFF" },
  permissionText: { fontSize: 15, color: TEXT_MUTED, textAlign: "center" },
  permissionButton: { alignSelf: "stretch", marginTop: 12 },
  cancelText: { fontSize: 15, color: TEXT_MUTED, marginTop: 8 },
  close: {
    position: "absolute",
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  closeText: { color: "#FFFFFF", fontSize: 18 },
  guideWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  guide: {
    width: 260,
    height: 340,
    borderRadius: 170,
    borderWidth: 2,
    borderColor: MINT_BORDER,
  },
  hint: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  shutterWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  shutterOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: MINT,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
  },
});
