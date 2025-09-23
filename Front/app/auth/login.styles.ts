import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#1b5e20",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#c8e6c9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#555",
    marginTop: 12,
    textAlign: "center",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    marginVertical: 20,
  },
});
