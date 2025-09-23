import {
  DefaultTheme,
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Screens (usa PascalCase en nombres y rutas de archivo)
import ForgotPasswordScreen from "./auth/ForgotPassword";
import LoginScreen from "./auth/login";
import RegisterScreen from "./auth/register";
import FeedScreen from "./feed/index";

// Tipado del stack
export type RootStackParamList = {
  Login: undefined;
  RegisterScreen: undefined;
  ForgotPassword: undefined;
  Feed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Ref global para navegación y depuración
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// (Opcional) Tema claro por defecto, sin bordes raros en web
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
  },
};

export default function App() {
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={AppTheme}
      onReady={() => {
        // Debug: ver rutas disponibles en el stack
        const state: any = navigationRef.getState?.();
        if (state?.routeNames) {
          // Útil para confirmar que "ForgotPassword" está registrado
          // eslint-disable-next-line no-console
          console.log("Rutas registradas:", state.routeNames);
        }
      }}
    >
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: "fade", // nativo: 'fade' soportado por native-stack
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
