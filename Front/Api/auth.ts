// api/auth.ts
import { api } from "./client";

type AuthRes = {
  accessToken?: string;
  refreshToken?: string;
  user?: any;
};

// --- YA TENÍAS ---
export async function login(email: string, password: string) {
  const { data } = await api.post<AuthRes>("/auth/login", { email, password });
  return data;
}
export async function register(username: string, email: string, password: string) {
  const { data } = await api.post<AuthRes>("/auth/register", { username, email, password });
  return data;
}
// Social si las usas...
export async function socialGoogle(code: string, redirectUri: string) {
  const { data } = await api.post<AuthRes>("/auth/google", { code, redirectUri });
  return data;
}
export async function socialFacebook(code: string, redirectUri: string) {
  const { data } = await api.post<AuthRes>("/auth/facebook", { code, redirectUri });
  return data;
}
export async function socialTwitter(code: string, redirectUri: string) {
  const { data } = await api.post<AuthRes>("/auth/twitter", { code, redirectUri });
  return data;
}

// --- NUEVO: Recuperación de contraseña ---
export async function requestPasswordReset(email: string) {
  // Cambia la ruta si tu backend usa otra, por ejemplo: "/auth/reset-password-request"
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resendPasswordReset(email: string) {
  // Si no tienes endpoint de reenvío, puedes reutilizar el anterior:
  // const { data } = await api.post("/auth/forgot-password", { email });
  const { data } = await api.post("/auth/forgot-password/resend", { email });
  return data;
}
