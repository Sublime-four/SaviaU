// src/lib/secure.ts
import * as SecureStore from "expo-secure-store";

const K = {
  access: "access_token",
  refresh: "refresh_token",
};

const isWeb = typeof document !== "undefined";

export async function setAccessToken(token: string) {
  isWeb ? localStorage.setItem(K.access, token) : await SecureStore.setItemAsync(K.access, token);
}
export async function getAccessToken() {
  return isWeb ? localStorage.getItem(K.access) : await SecureStore.getItemAsync(K.access);
}
export async function setRefreshToken(token: string) {
  isWeb ? localStorage.setItem(K.refresh, token) : await SecureStore.setItemAsync(K.refresh, token);
}
export async function getRefreshToken() {
  return isWeb ? localStorage.getItem(K.refresh) : await SecureStore.getItemAsync(K.refresh);
}
export async function clearTokens() {
  if (isWeb) {
    localStorage.removeItem(K.access);
    localStorage.removeItem(K.refresh);
  } else {
    await SecureStore.deleteItemAsync(K.access);
    await SecureStore.deleteItemAsync(K.refresh);
  }
}
