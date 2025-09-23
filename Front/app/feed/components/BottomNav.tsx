import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="home" size={28} color="#fff" />
        <Text style={styles.navText}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="search" size={28} color="#888" />
        <Text style={styles.navText}>Descubrir</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.recordButton}>
          <Ionicons name="add" size={32} color="#000" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="chatbubble" size={28} color="#888" />
        <Text style={styles.navText}>Mensajes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="person" size={28} color="#888" />
        <Text style={styles.navText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    borderTopWidth: 0.5, borderTopColor: "#222",
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navText: { color: "#888", fontSize: 12, marginTop: 4 },
  recordButton: { width: 48, height: 32, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", alignItems: "center" },
});
