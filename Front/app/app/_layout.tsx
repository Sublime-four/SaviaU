// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      {/* Expo Router descubre automáticamente los archivos en app/ */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="auth/ForgotPassword" />
      <Stack.Screen name="feed/index" />
    </Stack>
  );
}
