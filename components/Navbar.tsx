import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";
import Router from "next/router";

export default function Navbar() {
  const { isAuthenticated, logout, loading } = useContext(AuthContext)!;
  const [open, setOpen] = useState(false);

  if (loading) return null;

  const handleLogout = () => {
    logout();
    Router.push("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>MyApp</div>
      <div style={styles.rightSection}>
        {isAuthenticated && (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        )}
        <button style={styles.toggle} onClick={() => setOpen(!open)}>
          ⋮
        </button>
      </div>

      <ul style={{ ...styles.menu, ...(open ? styles.menuOpen : {}) }}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/list">List</Link></li>
        <li><Link href="/editor">Editor</Link></li>
        <li><Link href="/notification">Notification</Link></li>
      </ul>
    </nav>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    background: "#0070f3",
    color: "#fff",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 20,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  toggle: {
    fontSize: 22,
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  menu: {
    listStyle: "none",
    margin: 0,
    padding: 10,
    position: "absolute",
    top: 55,
    right: 10,
    background: "#bcc6d1",
    display: "none",
    flexDirection: "column",
    borderRadius: 4,
    minWidth: 140,
  },
  menuOpen: {
    display: "flex",
  },
  logoutBtn: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
  },
};
