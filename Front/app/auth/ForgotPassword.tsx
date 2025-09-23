import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  requestPasswordReset,
  resendPasswordReset,
} from "@/Api/auth"; // ajusta el alias/ruta si no usas "@/"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResetPassword = async () => {
    if (!email.includes("@")) {
      Alert.alert("Error", "Por favor ingresa un correo válido.");
      return;
    }

    try {
      setLoading(true);
      await requestPasswordReset(email.trim());
      setIsSubmitted(true);
      Alert.alert(
        "Correo enviado",
        "Te enviamos un enlace para restablecer tu contraseña."
      );
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        "No se pudo enviar el correo de restablecimiento.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    try {
      setResending(true);
      // Si no tienes endpoint de reenvío, puedes volver a llamar requestPasswordReset(email)
      await resendPasswordReset(email.trim());
      Alert.alert("Listo", "Se ha reenviado el enlace a tu correo.");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        "No se pudo reenviar el correo.";
      Alert.alert("Error", msg);
    } finally {
      setResending(false);
    }
  };

  const goBackToLogin = () => {
    router.replace("/auth/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#e8f5e9", "#c8e6c9"]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Ionicons name="key" size={60} color="#2e7d32" style={styles.icon} />
          <Text style={styles.title}>SaviaU</Text>
          <Text style={styles.subtitle}>
            {isSubmitted ? "Revisa tu correo electrónico" : "Recuperar Contraseña"}
          </Text>

          {isSubmitted ? (
            <>
              <Text style={styles.instructionText}>
                Hemos enviado un enlace de restablecimiento a{" "}
                <Text style={styles.emailText}>{email}</Text>. Revisa tu bandeja de
                entrada.
              </Text>

              <Text style={styles.noteText}>
                Si no lo recibes en unos minutos, revisa la carpeta de spam.
              </Text>

              <TouchableOpacity
                onPress={resendEmail}
                style={styles.buttonContainer}
                disabled={resending}
              >
                <LinearGradient colors={["#2e7d32", "#1b5e20"]} style={styles.button}>
                  <Text style={styles.buttonText}>
                    {resending ? "Reenviando..." : "Reenviar correo"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.instructionText}>
                Ingresa tu correo electrónico y te enviaremos un enlace para
                restablecer tu contraseña.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TouchableOpacity
                onPress={handleResetPassword}
                style={styles.buttonContainer}
                disabled={loading}
              >
                <LinearGradient colors={["#2e7d32", "#1b5e20"]} style={styles.button}>
                  <Text style={styles.buttonText}>
                    {loading ? "Enviando..." : "Enviar enlace"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={goBackToLogin} style={{ marginTop: 10 }}>
            <Text style={styles.backText}>
              <Ionicons name="arrow-back" size={16} color="#2e7d32" /> Volver al inicio de sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// (Si ya tienes estilos en otro archivo, puedes ignorar esto)
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: { marginBottom: 15 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2e7d32", marginBottom: 5 },
  subtitle: { fontSize: 18, color: "#555", marginBottom: 20, textAlign: "center", fontWeight: "600" },
  instructionText: { fontSize: 16, color: "#555", marginBottom: 25, textAlign: "center", lineHeight: 22 },
  noteText: { fontSize: 14, color: "#777", marginBottom: 25, textAlign: "center", fontStyle: "italic", lineHeight: 20 },
  emailText: { fontWeight: "bold", color: "#2e7d32" },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 25,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: { width: "100%", marginBottom: 20 },
  button: { padding: 16, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
  backText: { color: "#2e7d32", fontSize: 16, marginTop: 10 },
});
