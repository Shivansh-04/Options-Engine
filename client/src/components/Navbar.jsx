// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(27, 25, 49, 0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 28, height: 28,
            background: "var(--accent)",
            borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#1B1931", fontWeight: 700, fontSize: 13,
            fontFamily: "var(--font-head)",
          }}>Ω</span>
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15 }}>
            Options<span style={{ color: "var(--accent)" }}>Engine</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <NavLink to="/learn" active={isActive("/learn")}>Learn</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" active={isActive("/dashboard")}>Calculator</NavLink>
              <NavLink to="/history" active={isActive("/history")}>History</NavLink>
              <div style={{ width: 1, height: 16, background: "var(--border2)", margin: "0 8px" }} />
              <span style={{ color: "var(--text2)", fontSize: 12, marginRight: 8 }}>
                {user.name}
              </span>
              <button className="btn btn-ghost"
                style={{ padding: "6px 14px", fontSize: 12 }}
                onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" active={isActive("/login")}>Login</NavLink>
              <Link to="/register" className="btn btn-primary"
                style={{ padding: "7px 16px", fontSize: 12, color: "#1B1931" }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: "6px 12px",
      borderRadius: 6,
      fontSize: 13,
      color: active ? "var(--accent)" : "var(--text2)",
      background: active ? "var(--accent-dim)" : "transparent",
      transition: "var(--transition)",
    }}>{children}</Link>
  );
}