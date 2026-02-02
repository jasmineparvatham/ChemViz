import { createTheme } from "@mui/material/styles";

export const makeTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#1f3c88" },     // ChemViz blue
      secondary: { main: "#2ec4b6" },   // teal accent
      background: {
        default: mode === "dark" ? "#0b1220" : "#f5f7fa",
        paper: mode === "dark" ? "#0f172a" : "#ffffff",
      },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: ["Inter", "system-ui", "Arial"].join(","),
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
  });
