// src/pages/History.jsx
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/history");
      setHistory(data);
    } catch (e) {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/history/${id}`);
      setHistory((h) => h.filter((c) => c._id !== id));
      if (expanded === id) setExpanded(null);
    } catch (e) {}
    finally { setDeleting(null); }
  };

  if (loading) return (
    <div className="page" style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <Loader size={24} text="Loading history..." />
    </div>
  );

  return (
    <div className="page" style={{ paddingTop: 32 }}>
      <div className="page-title">Calculation History</div>
      <p className="page-sub">{history.length} calculation{history.length !== 1 ? "s" : ""} saved</p>

      {history.length === 0 ? (
        <div style={{
          height: 300, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          border: "1px dashed var(--border2)", borderRadius: 12,
          color: "var(--text3)", gap: 12,
        }}>
          <div style={{ fontSize: 32 }}>Ω</div>
          <div style={{ fontSize: 13 }}>No calculations yet — go to Dashboard to begin</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {history.map((calc, i) => (
            <div key={calc._id} className="card"
              style={{ animation: `fadeUp 0.4s ${i * 0.05}s ease both`, cursor: "pointer" }}
              onClick={() => setExpanded(expanded === calc._id ? null : calc._id)}>

              {/* Row header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span className={`tag ${calc.inputs.optionType === "call" ? "tag-green" : "tag-red"}`}>
                    {calc.inputs.optionType.toUpperCase()}
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15 }}>
                      {calc.stockSymbol}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                      S: ₹{calc.inputs.spotPrice} · K: ₹{calc.inputs.strikePrice} · σ: {(calc.inputs.volatility * 100).toFixed(0)}% · T: {calc.inputs.timeToExpiry}yr
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>BS Price</div>
                    <div style={{ color: "var(--accent)", fontSize: 16 }}>
                      ₹{calc.results.blackScholes.price.toFixed(4)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>MC Price</div>
                    <div style={{ fontSize: 16 }}>
                      ₹{calc.results.monteCarlo.price.toFixed(4)}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", minWidth: 80, textAlign: "right" }}>
                    {new Date(calc.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                  <button
                    className="btn btn-danger"
                    style={{ padding: "5px 12px", fontSize: 11 }}
                    onClick={(e) => { e.stopPropagation(); handleDelete(calc._id); }}
                    disabled={deleting === calc._id}>
                    {deleting === calc._id ? <Loader size={12} /> : "Delete"}
                  </button>
                </div>
              </div>

              {/* Expanded Greeks */}
              {expanded === calc._id && (
                <div style={{
                  marginTop: 20, paddingTop: 20,
                  borderTop: "1px solid var(--border)",
                  animation: "fadeIn 0.3s ease",
                }}>
                  <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                    Greeks
                  </div>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {Object.entries(calc.results.greeks).map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4, textTransform: "capitalize" }}>{k}</div>
                        <div style={{ color: "var(--text)" }}>{v.toFixed(6)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, fontSize: 11, color: "var(--text3)" }}>
                    Monte Carlo: {calc.results.monteCarlo.simulations.toLocaleString()} simulations · ±{calc.results.monteCarlo.standardError.toFixed(4)} std error
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}