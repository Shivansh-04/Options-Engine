// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// animated counter hook
function useCountUp(target, duration = 1500, decimals = 2) {
  const [value, setValue] = useState(0);
  const raf = useRef();
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, decimals]);
  return value;
}

function LiveDemo() {
  const price = useCountUp(132.1994, 1800, 4);
  const delta = useCountUp(0.5167, 2000, 4);
  const mc = useCountUp(133.9132, 2200, 4);
  const theta = useCountUp(0.9510, 1600, 4);
  const vega = useCountUp(4.8828, 2400, 4);

  return (
    <div style={{
      background: "var(--bg2)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
    }}>
      {/* Terminal header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ color: "var(--text3)", fontSize: 11, marginLeft: 8 }}>
          RELIANCE • CALL • Strike ₹2500 • Expiry 3M
        </span>
      </div>

      <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DemoMetric label="Black-Scholes" value={`₹${price}`} accent />
        <DemoMetric label="Monte Carlo" value={`₹${mc}`} accent />
        <DemoMetric label="Delta" value={delta} />
        <DemoMetric label="Theta / day" value={`-${theta}`} />
        <DemoMetric label="Vega" value={vega} />
        <DemoMetric label="Simulations" value="10,000" />
      </div>
    </div>
  );
}

function DemoMetric({ label, value, accent }) {
  return (
    <div style={{
      background: "var(--bg3)",
      border: `1px solid ${accent ? "var(--accent-border)" : "var(--border)"}`,
      borderRadius: 8, padding: "12px 14px",
    }}>
      <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{
        fontSize: 18, fontWeight: 500,
        color: accent ? "var(--accent)" : "var(--text)",
        animation: "countUp 0.4s ease",
      }}>
        {value}
      </div>
    </div>
  );
}

const features = [
  {
    tag: "01",
    title: "Black-Scholes",
    desc: "Closed-form Nobel Prize-winning formula for instant, precise option pricing. Implemented from scratch — zero external libraries.",
  },
  {
    tag: "02",
    title: "All 5 Greeks",
    desc: "Delta, Gamma, Theta, Vega, Rho — complete risk sensitivity analysis used by every professional trading desk globally.",
  },
  {
    tag: "03",
    title: "Monte Carlo",
    desc: "10,000 Geometric Brownian Motion simulations using Box-Muller transform. Statistical validation with standard error reporting.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "calc(100vh - 56px)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center",
        paddingTop: 60,
        paddingBottom: 60,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>
        {/* Left */}
        <div>
          <div className="tag tag-green" style={{ marginBottom: 20 }}>
            ◉ Live Engine
          </div>
          <h1 style={{
            fontFamily: "var(--font-head)",
            fontSize: "clamp(36px, 5vw, 58px)",
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 20,
            letterSpacing: "-0.02em",
          }}>
            Options Pricing<br />
            <span style={{ color: "var(--accent)" }}>From Scratch.</span>
          </h1>
          <p style={{
            color: "var(--text2)",
            fontSize: 15,
            lineHeight: 1.7,
            maxWidth: 420,
            marginBottom: 36,
          }}>
            Black-Scholes, Greeks, and Monte Carlo simulation — pure mathematics, no external libraries. Built for quant finance enthusiasts.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary">
              {user ? "Open Calculator →" : "Get Started →"}
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Sign In
            </Link>
          </div>
          {/* Stats row */}
          <div style={{
            display: "flex", gap: 32, marginTop: 48,
            paddingTop: 32, borderTop: "1px solid var(--border)",
          }}>
            {[["10K+","Simulations/calc"],["5","Greeks computed"],["3","Pricing models"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{n}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Live Demo */}
        <div style={{ animation: "fadeUp 0.7s 0.2s ease both" }}>
          <LiveDemo />
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
            Under the hood
          </p>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: 32, fontWeight: 700 }}>
            Three engines. One API.
          </h2>
        </div>

        <div className="grid-3">
          {features.map((f, i) => (
            <div key={i} className="card" style={{
              animation: `fadeUp 0.5s ${0.1 * i}s ease both`,
              borderTop: "2px solid var(--accent)",
              transition: "border-color 0.2s",
            }}>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", marginBottom: 16 }}>
                {f.tag}
              </div>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                {f.title}
              </h3>
              <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "48px",
        marginBottom: 80,
        textAlign: "center",
      }}>
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
          Start calculating now.
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 28, fontSize: 14 }}>
          Free. No credit card. Just math.
        </p>
        <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary" style={{ fontSize: 14, padding: "14px 32px" }}>
          {user ? "Open Dashboard →" : "Create Free Account →"}
        </Link>
      </section>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "var(--text3)", fontSize: 12, marginBottom: 24,
      }}>
        <span>Options<span style={{ color: "var(--accent)" }}>Engine</span> — Built with pure mathematics</span>
        <span>Black-Scholes • Greeks • Monte Carlo</span>
      </div>
    </div>
  );
}