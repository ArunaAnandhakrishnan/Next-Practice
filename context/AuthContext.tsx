// context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read token from cookie first
    const cookies = document.cookie.split("; ").reduce((acc, current) => {
      const [key, value] = current.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const savedToken = cookies.token || localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data: { token: string } = await res.json();

      // Store in localStorage
      localStorage.setItem("token", data.token);
      // Store in cookie for middleware
      document.cookie = `token=${data.token}; path=/; max-age=86400`; // 1 day

      setToken(data.token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0"; // delete cookie
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
