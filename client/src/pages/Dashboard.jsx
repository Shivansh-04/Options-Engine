// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const defaultForm = {
  stockSymbol: "",
  spotPrice: "",
  strikePrice: "",
  timeToExpiry: "",
  volatility: "",
  riskFreeRate: "",
  optionType: "call",
};

function GreekCard({ label, value, desc }) {
  return (
    <div className="card" style={{ animation: "countUp 0.4s ease" }}>
      <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, color: "var(--text)", marginBottom: 6 }}>
        {typeof value === "number" ? value.toFixed(6) : value}
      </div>
      <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

function ResultCard({ label, value, sub, accent }) {
  return (
    <div className="card" style={{
      borderTop: accent ? "2px solid var(--accent)" : "2px solid var(--border2)",
      animation: "countUp 0.5s ease",
    }}>
      <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 10 }}>{label}</div>
      <div style={{
        fontSize: 32, fontWeight: 500,
        color: accent ? "var(--accent)" : "var(--text)",
        marginBottom: 6,
      }}>
        ₹{typeof value === "number" ? value.toFixed(4) : value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--text3)" }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/stocks/samples")
      .then(({ data }) => setStocks(data))
      .catch(() => {})
      .finally(() => setStocksLoading(false));
  }, []);

  const handleStockSelect = (symbol) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock) return;
    setForm((f) => ({
      ...f,
      stockSymbol: stock.symbol,
      spotPrice: stock.currentPrice,
      volatility: stock.volatility,
      riskFreeRate: stock.riskFreeRate,
    }));
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const { data } = await api.post("/price/calculate", {
        ...form,
        spotPrice: parseFloat(form.spotPrice),
        strikePrice: parseFloat(form.strikePrice),
        timeToExpiry: parseFloat(form.timeToExpiry),
        volatility: parseFloat(form.volatility),
        riskFreeRate: parseFloat(form.riskFreeRate),
      });
      setResult(data);
    } catch (e) {
      setError(e.response?.data?.message || "Calculation failed");
    } finally { setLoading(false); }
  };

  const greeksInfo = [
    { key: "delta", label: "Delta", desc: "Price change per ₹1 move in stock" },
    { key: "gamma", label: "Gamma", desc: "Rate of change of Delta" },
    { key: "theta", label: "Theta", desc: "Daily time decay (₹/day)" },
    { key: "vega", label: "Vega", desc: "Price change per 1% volatility shift" },
    { key: "rho", label: "Rho", desc: "Price change per 1% rate shift" },
  ];

  return (
    <div className="page" style={{ paddingTop: 32 }}>
      <div className="page-title">Options Calculator</div>
      <p className="page-sub">Black-Scholes · Greeks · Monte Carlo — all three engines fire on every calculation</p>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "start" }}>

        {/* ── Left: Form ── */}
        <div className="card" style={{ position: "sticky", top: 80 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Quick Select Stock
            </div>
            {stocksLoading ? <Loader text="Loading stocks..." /> : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {stocks.map((s) => (
                  <button key={s.symbol}
                    onClick={() => handleStockSelect(s.symbol)}
                    style={{
                      padding: "5px 12px", borderRadius: 20, fontSize: 11,
                      border: `1px solid ${form.stockSymbol === s.symbol ? "var(--accent)" : "var(--border2)"}`,
                      background: form.stockSymbol === s.symbol ? "var(--accent-dim)" : "transparent",
                      color: form.stockSymbol === s.symbol ? "var(--accent)" : "var(--text2)",
                      transition: "var(--transition)",
                    }}>
                    {s.symbol}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />

          {error && (
            <div style={{
              background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 16,
              color: "var(--red)", fontSize: 13,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="input-group">
              <label>Option Type</label>
              <select className="input-field" name="optionType" value={form.optionType} onChange={handleChange}>
                <option value="call">Call Option</option>
                <option value="put">Put Option</option>
              </select>
            </div>
            <div className="input-group">
              <label>Spot Price (S) ₹</label>
              <input className="input-field" name="spotPrice" type="number" step="any"
                placeholder="e.g. 2450" value={form.spotPrice} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Strike Price (K) ₹</label>
              <input className="input-field" name="strikePrice" type="number" step="any"
                placeholder="e.g. 2500" value={form.strikePrice} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Time to Expiry (T) — in years</label>
              <input className="input-field" name="timeToExpiry" type="number" step="any"
                placeholder="e.g. 0.25 = 3 months" value={form.timeToExpiry} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Volatility (σ) — decimal</label>
              <input className="input-field" name="volatility" type="number" step="any"
                placeholder="e.g. 0.28 = 28%" value={form.volatility} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Risk-Free Rate (r) — decimal</label>
              <input className="input-field" name="riskFreeRate" type="number" step="any"
                placeholder="e.g. 0.065 = 6.5%" value={form.riskFreeRate} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
              disabled={loading}>
              {loading ? <><Loader size={15} /><span>Running engines...</span></> : "Calculate →"}
            </button>
          </form>
        </div>

        {/* ── Right: Results ── */}
        <div>
          {!result && !loading && (
            <div style={{
              height: 300, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              border: "1px dashed var(--border2)", borderRadius: 12,
              color: "var(--text3)", gap: 12,
            }}>
              <div style={{ fontSize: 32 }}>Ω</div>
              <div style={{ fontSize: 13 }}>Select a stock and fill the form to begin</div>
            </div>
          )}

          {loading && (
            <div style={{
              height: 300, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 16,
            }}>
              <Loader size={28} />
              <div style={{ color: "var(--text2)", fontSize: 13 }}>
                Running 10,000 Monte Carlo simulations...
              </div>
            </div>
          )}

          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.4s ease" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700 }}>
                    {result.stockSymbol} — {result.inputs.optionType.toUpperCase()} Option
                  </div>
                  <div style={{ color: "var(--text3)", fontSize: 12, marginTop: 4 }}>
                    S: ₹{result.inputs.spotPrice} · K: ₹{result.inputs.strikePrice} · T: {result.inputs.timeToExpiry}yr · σ: {(result.inputs.volatility * 100).toFixed(0)}%
                  </div>
                </div>
                <span className="tag tag-green">✓ Calculated</span>
              </div>

              {/* Pricing results */}
              <div>
                <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Pricing Models
                </div>
                <div className="grid-2">
                  <ResultCard label="Black-Scholes Price" value={result.results.blackScholes.price} accent />
                  <ResultCard
                    label="Monte Carlo Price"
                    value={result.results.monteCarlo.price}
                    sub={`±${result.results.monteCarlo.standardError.toFixed(4)} std error · ${result.results.monteCarlo.simulations.toLocaleString()} simulations`}
                  />
                </div>
              </div>

              {/* BS internals */}
              <div className="card" style={{ background: "var(--bg3)" }}>
                <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Black-Scholes Internals
                </div>
                <div style={{ display: "flex", gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>d1</div>
                    <div style={{ color: "var(--accent)" }}>{result.results.blackScholes.d1}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>d2</div>
                    <div style={{ color: "var(--accent)" }}>{result.results.blackScholes.d2}</div>
                  </div>
                </div>
              </div>

              {/* Greeks */}
              <div>
                <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  The Greeks — Risk Sensitivities
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                  {greeksInfo.map(({ key, label, desc }) => (
                    <GreekCard key={key} label={label} value={result.results.greeks[key]} desc={desc} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}