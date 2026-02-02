import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { makeTheme } from "./theme";

function Root() {
  const [mode, setMode] = useState(() => sessionStorage.getItem("mode") || "light");
  const theme = useMemo(() => makeTheme(mode), [mode]);

  const toggleMode = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    sessionStorage.setItem("mode", next);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App mode={mode} toggleMode={toggleMode} />
      </AuthProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
