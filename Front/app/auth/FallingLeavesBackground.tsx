// app/auth/FallingLeavesBackground.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Image, StyleSheet, View } from "react-native";
import hoja from "../../assets/hoja.png"; // ← ruta relativa correcta

const { width, height } = Dimensions.get("window");
const LEAF_SOURCES = [hoja];

function Leaf({ delay = 0, size = 40, startX = 0, speed = 1, drift = 50, blur = 1.2 }) {
  const y = useRef(new Animated.Value(-120)).current;
  const x = useRef(new Animated.Value(startX)).current;
  const r = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fall = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: height + 140, duration: 6500 * speed, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(y, { toValue: -120, duration: 0, useNativeDriver: true }),
      ]),
      { resetBeforeIteration: true }
    );

    const sway = Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: startX + drift, duration: 2600 * speed, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(x, { toValue: startX - drift, duration: 2600 * speed, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    const spin = Animated.loop(
      Animated.timing(r, { toValue: 1, duration: 5200 * speed, easing: Easing.linear, useNativeDriver: true })
    );

    const t = setTimeout(() => { fall.start(); sway.start(); spin.start(); }, delay);
    return () => { clearTimeout(t); fall.stop(); sway.stop(); spin.stop(); };
  }, [delay, drift, height, r, speed, startX, x, y]);

  const rotate = r.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Animated.View style={[styles.leafWrap, { transform: [{ translateY: y }, { translateX: x }, { rotate }] }]}>
      <Image source={LEAF_SOURCES[0]} style={{ width: size, height: size }} resizeMode="contain" blurRadius={blur} />
    </Animated.View>
  );
}

export default function FallingLeavesBackground() {
  const leaves = Array.from({ length: 12 }).map((_, i) => ({
    key: i,
    delay: i * 450,
    size: 26 + Math.random() * 36,
    startX: Math.random() * (width - 48),
    speed: 0.8 + Math.random() * 0.6,
    drift: 30 + Math.random() * 60,
    blur: 0.8 + Math.random() * 1.4,
  }));

  return (
    <View pointerEvents="none" style={styles.wrap}>
      {leaves.map(l => (
        <Leaf key={l.key} delay={l.delay} size={l.size} startX={l.startX} speed={l.speed} drift={l.drift} blur={l.blur} />
      ))}
      <View style={styles.softOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFillObject },
  leafWrap: { position: "absolute", left: 0, top: 0 },
  softOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.10)" },
});
