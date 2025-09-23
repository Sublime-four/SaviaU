import React from "react";
import { StyleSheet, Text, View } from "react-native";

type RankItem = { label: string; value: string };
type Props = { items?: RankItem[]; title?: string };

const defaultItems: RankItem[] = [
  { label: "Tendencia", value: "#Ecología" },
  { label: "Top 1", value: "Reforestación" },
];

export default function Rankings({ items = defaultItems, title = "Rankings" }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {items.map((it, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.label}>{it.label}</Text>
          <Text style={styles.value}>{it.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#111", padding: 12, borderRadius: 12 },
  title: { color: "#fff", fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3 },
  label: { color: "#aaa" },
  value: { color: "#2e7d32", fontWeight: "700" },
});
