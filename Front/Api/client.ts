import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from "@/src/lib/secure"; // ajusta si tu ruta difiere
import axios from "axios";
import Constants from "expo-constants";

const API_URL = (Constants.expoConfig?.extra as any)?.apiUrl || "http://10.0.2.2:8080/api"; // TODO: actualizo con tu BASE_URL

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Adjuntar access token
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh automático
let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (status === 401 && !original._retry) {
      original._retry = true;

      if (refreshing) {
        await new Promise<void>((resolve) => queue.push(resolve));
      } else {
        try {
          refreshing = true;
          const rt = await getRefreshToken();
          if (!rt) throw new Error("No refresh token");

          // TODO: endpoint exacto /auth/refresh y nombre de campo
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: rt });
          await setAccessToken(data.accessToken);

          queue.forEach((fn) => fn());
          queue = [];
        } catch (e) {
          await clearTokens();
          queue.forEach((fn) => fn());
          queue = [];
          throw e;
        } finally {
          refreshing = false;
        }
      }

      const token = await getAccessToken();
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    }

    return Promise.reject(error);
  }
);
