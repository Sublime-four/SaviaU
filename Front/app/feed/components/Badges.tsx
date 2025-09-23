import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = { verified?: boolean };

export default function Badges({ verified }: Props) {
  if (!verified) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>✔</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#2e7d32",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
