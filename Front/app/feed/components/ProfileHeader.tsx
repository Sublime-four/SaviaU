import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Badges from "./Badges";

type Props = {
  name: string;
  avatar: string;
  verified?: boolean;
  textColor?: string;
};

export default function ProfileHeader({ name, avatar, verified, textColor = "#fff" }: Props) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <Text style={[styles.name, { color: textColor }]}>@{name}</Text>
      <Badges verified={verified} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  name: { fontWeight: "700", fontSize: 14 },
});
