// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

export default function Register() {
  const { register, loading, error, user, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => { if (user) navigate("/dashboard"); }, [user]);
  useEffect(() => { return () => setError(null); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await register(form.name, form.email, form.password);
    if (ok) navigate("/dashboard");
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 56px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.5s ease" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, background: "var(--accent)",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#000", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18,
            marginBottom: 20,
          }}>Ω</div>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
            Create account
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 13 }}>
            Start pricing options for free
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)",
            borderRadius: 8, padding: "10px 14px", marginBottom: 20,
            color: "var(--red)", fontSize: 13,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="input-group">
            <label>Full Name</label>
            <input className="input-field" type="text" placeholder="Shivansh Gupta"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input className="input-field" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input className="input-field" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            disabled={loading}>
            {loading ? <Loader size={16} /> : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, color: "var(--text2)", fontSize: 13 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}