// app/auth/login.tsx (o LoginScreen.tsx)
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import FallingLeavesBackground from "./FallingLeavesBackground";
import { loginStyles as styles } from "./login.styles";

// ⬇️ importa tus helpers/servicios
import { login as loginApi, socialFacebook, socialGoogle, socialTwitter } from "@/Api/auth";
import { setAccessToken, setRefreshToken } from "@/src/lib/secure"; // ajusta la ruta si pusiste otra

WebBrowser.maybeCompleteAuthSession();

// IDs desde app.json → expo.extra
const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId as string | undefined;
const FACEBOOK_APP_ID  = Constants.expoConfig?.extra?.facebookAppId as string | undefined;
const TWITTER_CLIENT_ID = Constants.expoConfig?.extra?.twitterClientId as string | undefined;

// Usa el mismo scheme configurado en app.json ("miapp")
const redirectUri = AuthSession.makeRedirectUri({ scheme: "miapp" });

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------ Email/Password (Spring Boot) ------------
  const handleLogin = async () => {
    if (!email.includes("@")) return Alert.alert("Error", "Por favor ingresa un correo válido.");
    if (password.length < 6) return Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");

    try {
      setLoading(true);
      const res = await loginApi(email.trim(), password); // -> { accessToken, refreshToken, user }

      if (res?.accessToken) await setAccessToken(res.accessToken);
      if (res?.refreshToken) await setRefreshToken(res.refreshToken);

      router.replace("/feed");
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "No se pudo iniciar sesión";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  // ------------ Google ------------
  const handleLoginGoogle = async () => {
    try {
      if (!GOOGLE_CLIENT_ID) {
        Alert.alert("Config faltante", "Falta GOOGLE_CLIENT_ID en app.json (expo.extra.googleClientId).");
        return;
      }
      const discovery = {
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenEndpoint: "https://oauth2.googleapis.com/token",
      };
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        scopes: ["openid", "profile", "email"],
        usePKCE: true,
      });

      const res = await request.promptAsync(discovery);
      if (res.type !== "success" || !res.params?.code) {
        if (res.type !== "dismiss") Alert.alert("Cancelado", "No se completó el inicio con Google.");
        return;
      }

      // Intercambia el authorization code en TU backend
      const data = await socialGoogle(res.params.code, redirectUri); // -> { accessToken, refreshToken, user }

      if (data?.accessToken) await setAccessToken(data.accessToken);
      if (data?.refreshToken) await setRefreshToken(data.refreshToken);

      router.replace("/feed");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo iniciar sesión con Google.");
    }
  };

  // ------------ Facebook ------------
  const handleLoginFacebook = async () => {
    try {
      if (!FACEBOOK_APP_ID) {
        Alert.alert("Config faltante", "Falta FACEBOOK_APP_ID en app.json (expo.extra.facebookAppId).");
        return;
      }
      const discovery = {
        authorizationEndpoint: "https://www.facebook.com/v16.0/dialog/oauth",
        tokenEndpoint: "https://graph.facebook.com/v16.0/oauth/access_token",
      };
      const request = new AuthSession.AuthRequest({
        clientId: FACEBOOK_APP_ID,
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        scopes: ["public_profile", "email"],
        usePKCE: true,
      });

      const res = await request.promptAsync(discovery);
      if (res.type !== "success" || !res.params?.code) {
        if (res.type !== "dismiss") Alert.alert("Cancelado", "No se completó el inicio con Facebook.");
        return;
      }

      const data = await socialFacebook(res.params.code, redirectUri);
      if (data?.accessToken) await setAccessToken(data.accessToken);
      if (data?.refreshToken) await setRefreshToken(data.refreshToken);

      router.replace("/feed");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo iniciar sesión con Facebook.");
    }
  };

  // ------------ Twitter/X ------------
  const handleLoginTwitter = async () => {
    try {
      if (!TWITTER_CLIENT_ID) {
        Alert.alert("Config faltante", "Falta TWITTER_CLIENT_ID en app.json (expo.extra.twitterClientId).");
        return;
      }
      const discovery = {
        authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
        tokenEndpoint: "https://api.twitter.com/2/oauth2/token",
      };
      const request = new AuthSession.AuthRequest({
        clientId: TWITTER_CLIENT_ID,
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        scopes: ["tweet.read", "users.read", "offline.access"],
        usePKCE: true,
      });

      const res = await request.promptAsync(discovery);
      if (res.type !== "success" || !res.params?.code) {
        if (res.type !== "dismiss") Alert.alert("Cancelado", "No se completó el inicio con Twitter/X.");
        return;
      }

      const data = await socialTwitter(res.params.code, redirectUri);
      if (data?.accessToken) await setAccessToken(data.accessToken);
      if (data?.refreshToken) await setRefreshToken(data.refreshToken);

      router.replace("/feed");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo iniciar sesión con Twitter/X.");
    }
  };

  const goForgot   = () => router.push("/auth/ForgotPassword");
  const goRegister = () => router.push("/auth/register");

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#e8f5e9", "#c8e6c9"]} style={StyleSheet.absoluteFillObject} />
      <FallingLeavesBackground />

      <View style={styles.card}>
        <Ionicons name="leaf" size={60} color="#2e7d32" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>SaviaU</Text>
        <Text style={styles.subtitle}>Inicia Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={handleLogin} style={{ width: "100%", opacity: loading ? 0.7 : 1 }}>
          <LinearGradient colors={["#2e7d32", "#1b5e20"]} style={styles.button}>
            <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={goForgot} style={{ marginTop: 10 }}>
          <Text style={{ color: "#2e7d32" }}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <TouchableOpacity onPress={handleLoginGoogle} accessibilityLabel="Iniciar con Google">
            <AntDesign name="google" size={28} color="red" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLoginFacebook} accessibilityLabel="Iniciar con Facebook">
            <AntDesign name="facebook-square" size={28} color="#3b5998" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLoginTwitter} accessibilityLabel="Iniciar con Twitter">
            <AntDesign name="twitter" size={28} color="#1DA1F2" />
          </TouchableOpacity>
        </View>

        <Text style={styles.link}>
          ¿No tienes cuenta?{" "}
          <Text style={{ color: "#2e7d32" }} onPress={goRegister}>
            Regístrate
          </Text>
        </Text>
      </View>
    </View>
  );
}
