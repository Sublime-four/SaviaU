// app/auth/register.tsx
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

// ⬇️ servicios hacia tu backend
import {
  register as registerApi,
  socialFacebook,
  socialGoogle,
  socialTwitter,
} from "@/Api/auth";

WebBrowser.maybeCompleteAuthSession();

// IDs desde app.json → expo.extra
const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId as string | undefined;
const FACEBOOK_APP_ID  = Constants.expoConfig?.extra?.facebookAppId as string | undefined;
const TWITTER_CLIENT_ID = Constants.expoConfig?.extra?.twitterClientId as string | undefined;

// Usa el mismo scheme que definiste en app.json (p. ej. "miapp")
const redirectUri = AuthSession.makeRedirectUri({ scheme: "miapp" });

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const goLogin = () => router.push("/auth/login");

  // === Registro por email/password (Spring Boot) ===
  const handleRegister = async () => {
    if (name.trim().length < 3) return Alert.alert("Error", "El nombre debe tener al menos 3 caracteres.");
    if (!email.includes("@")) return Alert.alert("Error", "Por favor ingresa un correo válido.");
    if (password.length < 6) return Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirmPassword) return Alert.alert("Error", "Las contraseñas no coinciden.");

    try {
      setLoading(true);
      // 👇 tu backend espera 'username'
      await registerApi(name.trim(), email.trim(), password);
      Alert.alert("Éxito", "Tu cuenta ha sido creada.");
      router.replace("/auth/login"); // o router.replace("/feed") si tu API ya inicia sesión al registrarse
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "No se pudo registrar.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  // === Social: Google ===
  const handleRegisterGoogle = async () => {
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
        if (res.type !== "dismiss") Alert.alert("Cancelado", "No se completó el registro con Google.");
        return;
      }
      // Envía el authorization code a TU backend (si tienes /auth/google)
      await socialGoogle(res.params.code, redirectUri);
      router.replace("/feed");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo continuar con Google.");
    }
  };

  // === Social: Facebook ===
  const handleRegisterFacebook = async () => {
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
        if (res.type !== "dismiss") Alert.alert("Cancelado", "No se completó el registro con Facebook.");
        return;
      }
      await socialFacebook(res.params.code, redirectUri);
      router.replace("/feed");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo continuar con Facebook.");
    }
  };

  // === Social: Twitter/X (OAuth 2.0 PKCE) ===
  const handleRegisterTwitter = async () => {
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
        if (res.type !== "dismiss") Alert.alert("Cancelado", "No se completó el registro con Twitter/X.");
        return;
      }
      await socialTwitter(res.params.code, redirectUri);
      router.replace("/feed");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo continuar con Twitter/X.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#e8f5e9", "#c8e6c9"]} style={StyleSheet.absoluteFillObject} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Ionicons name="person-add" size={60} color="#2e7d32" style={styles.icon} />
          <Text style={styles.title}>SaviaU</Text>
          <Text style={styles.subtitle}>Crear Cuenta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#777" />
            </Pressable>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar contraseña"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#777" />
            </Pressable>
          </View>

          <TouchableOpacity onPress={handleRegister} style={styles.buttonContainer} disabled={loading}>
            <LinearGradient colors={["#2e7d32", "#1b5e20"]} style={styles.button}>
              <Text style={styles.buttonText}>{loading ? "Creando..." : "Registrarse"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <TouchableOpacity onPress={handleRegisterGoogle} accessibilityLabel="Registrarse con Google">
              <AntDesign name="google" size={28} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegisterFacebook} accessibilityLabel="Registrarse con Facebook">
              <AntDesign name="facebook-square" size={28} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegisterTwitter} accessibilityLabel="Registrarse con Twitter">
              <AntDesign name="twitter" size={28} color="#1DA1F2" />
            </TouchableOpacity>
          </View>

          <Text style={styles.link}>
            ¿Ya tienes cuenta?{" "}
            <Pressable onPress={goLogin}>
              <Text style={styles.linkButton}>Inicia Sesión</Text>
            </Pressable>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// estilos locales si no los tenías (opcional)
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    width: "100%", maxWidth: 400, backgroundColor: "white", borderRadius: 16, padding: 30, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5,
  },
  icon: { marginBottom: 15 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2e7d32", marginBottom: 5 },
  subtitle: { fontSize: 18, color: "#555", marginBottom: 20, textAlign: "center", fontWeight: "600" },
  input: {
    width: "100%", padding: 15, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, marginBottom: 15,
    fontSize: 16, backgroundColor: "#f9f9f9",
  },
  passwordContainer: { width: "100%", marginBottom: 15, position: "relative" },
  passwordInput: {
    width: "100%", padding: 15, paddingRight: 40, borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    fontSize: 16, backgroundColor: "#f9f9f9",
  },
  eyeIcon: { position: "absolute", right: 12, top: 12, padding: 4 },
  buttonContainer: { width: "100%", marginTop: 5 },
  button: { padding: 16, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
  socialContainer: { flexDirection: "row", gap: 24, marginTop: 20, marginBottom: 6 },
  link: { color: "#555", marginTop: 10 },
  linkButton: { color: "#2e7d32", fontWeight: "600" },
});
