import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ActionButton from "./action-button";

type Props = {
  uri: string;
  onConfirm: () => void;
  onRetake: () => void;
};

export default function PhotoConfirm({ uri, onConfirm, onRetake }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Image source={{ uri }} style={styles.photo} resizeMode="cover" />

      <View style={styles.actions}>
        <ActionButton label="Enviar" onPress={onConfirm} />
        <ActionButton
          label="Tirar novamente"
          variant="secondary"
          onPress={onRetake}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    gap: 20,
  },
  photo: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: "#111111",
  },
  actions: { gap: 12 },
});
