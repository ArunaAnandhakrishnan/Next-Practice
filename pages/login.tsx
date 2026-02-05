import React, { useState, useContext, FormEvent,CSSProperties } from "react";
import { AuthContext } from "../context/AuthContext";
import Router from "next/router";

export default function LoginPage() {
  const auth = useContext(AuthContext);

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Registration handled directly here
    if (isRegister) {
      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage("Registered successfully! Please login.");
          setIsRegister(false);
          setPassword("");
        } else {
          setMessage(data.message || "Registration failed");
        }
      } catch {
        setMessage("Server error");
      }
      return;
    }

    // 🔐 LOGIN (delegated to AuthContext)
    const success = await auth.login(username, password);

    if (success) {
      Router.push("/");
    } else {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <h1>{isRegister ? "Register" : "Login"}</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={styles.submitBtn}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p
        style={styles.toggleText}
        onClick={() => {
          setIsRegister(!isRegister);
          setMessage("");
          setPassword("");
        }}
      >
        {isRegister
          ? "Already have an account? Login now"
          : "New user? Register now"}
      </p>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}
const styles: Record<string, CSSProperties> = {
  container: {
    maxWidth: 400,
    margin: "50px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 20,
  },
  submitBtn: {
    padding: "10px 20px",
    background: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "bold",
  },
  toggleText: {
    marginTop: 15,
    color: "#0070f3",
    cursor: "pointer",
    textDecoration: "underline",
  },
  message: {
    marginTop: 15,
    color: "green",
    fontWeight: "bold",
  },
};
