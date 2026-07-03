import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginApi, logoutApi } from "../services/auth.service.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginApi(email, password);
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data.employee));
      setUser(data.data.employee);
      return data.data.employee;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await logoutApi(); } catch {}
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
