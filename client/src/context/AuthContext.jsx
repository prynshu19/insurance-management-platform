import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    const { user: userData, token: jwt } = data.data;
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    const { user: userData, token: jwt } = data.data;
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
