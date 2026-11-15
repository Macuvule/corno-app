import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HistoryHeader from "./components/history-header";
import HistoryItem from "./components/history-item";
import { HISTORY } from "./components/history-data";

// Altura do tabBar flutuante + folga
const TAB_BAR_SPACE = 68 + 12 + 16;

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        data={HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryItem entry={item} />}
        ListHeaderComponent={<HistoryHeader count={HISTORY.length} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + TAB_BAR_SPACE,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  separator: {
    height: 12,
  },
});
