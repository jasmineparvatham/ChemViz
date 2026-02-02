import React, { createContext, useContext, useMemo, useState } from "react";
import { createClient } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("access") || "");

  const [latestReport, setLatestReport] = useState(() => {
    const raw = sessionStorage.getItem("latestReport");
    return raw ? JSON.parse(raw) : null;
  });

  const value = useMemo(() => {
    const getToken = () => token;
    const client = createClient(getToken);

    const login = (access) => {
      setToken(access);
      sessionStorage.setItem("access", access);
    };

    const logout = () => {
      setToken("");
      sessionStorage.removeItem("access");
    };

    const saveLatestReport = (report) => {
      setLatestReport(report);
      // sessionStorage is optional; never crash UI
      try {
        sessionStorage.setItem("latestReport", JSON.stringify(report));
      } catch (err) {
        console.warn("Could not persist latestReport:", err);
      }
    };

    return {
      token,
      client,
      login,
      logout,
      isAuthed: !!token,
      latestReport,
      saveLatestReport,
    };
  }, [token, latestReport]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
