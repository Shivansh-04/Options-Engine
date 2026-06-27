// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from "recharts";

// ── Helpers ──────────────────────────────────────────
const bs = (S, K, T, r, sigma, type) => {
  if (T <= 0) return Math.max(type === "call" ? S - K : K - S, 0);
  const normalCDF = (x) => {
    const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
    return 0.5*(1.0+sign*y);
  };
  const d1 = (Math.log(S/K)+(r+sigma*sigma/2)*T)/(sigma*Math.sqrt(T));
  const d2 = d1 - sigma*Math.sqrt(T);
  if (type === "call") return S*normalCDF(d1) - K*Math.exp(-r*T)*normalCDF(d2);
  return K*Math.exp(-r*T)*normalCDF(-d2) - S*normalCDF(-d1);
};

// ── Payoff Diagram ────────────────────────────────────
function PayoffDiagram({ inputs, results }) {
  if (!inputs || !results) return null;

  const { spotPrice: S, strikePrice: K, timeToExpiry: T,
          volatility: sigma, riskFreeRate: r, optionType: type } = inputs;
  const premium = results.blackScholes.price;

  // generate price range ±40% around spot
  const lo = Math.round(S * 0.60);
  const hi = Math.round(S * 1.40);
  const step = Math.round((hi - lo) / 60);

  const data = [];
  for (let price = lo; price <= hi; price += step) {
    const intrinsic = type === "call"
      ? Math.max(price - K, 0)
      : Math.max(K - price, 0);
    const payoffAtExpiry = intrinsic - premium;
    const currentValue = bs(price, K, T, r, sigma, type) - premium;
    data.push({
      price,
      "P&L at Expiry": parseFloat(payoffAtExpiry.toFixed(2)),
      "Current Value": parseFloat(currentValue.toFixed(2)),
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: "var(--bg3)", border: "1px solid var(--border)",
        borderRadius: 8, padding: "10px 14px", fontSize: 12,
      }}>
        <div style={{ color: "var(--text3)", marginBottom: 6 }}>Stock @ ₹{label}</div>
        {payload.map((p) => (
          <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
            {p.name}: <span style={{ color: p.value >= 0 ? "#4ade80" : "#f87171" }}>
              {p.value >= 0 ? "+" : ""}₹{p.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          Payoff Diagram
        </div>
        <div style={{ color: "var(--text3)", fontSize: 12 }}>
          P&L at different stock prices · Premium paid: ₹{premium.toFixed(4)}
        </div>
      </div>

      {/* Legend cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Break-even", value: `₹${type === "call" ? (K + premium).toFixed(2) : (K - premium).toFixed(2)}`, color: "var(--accent)" },
          { label: "Max Loss", value: `-₹${premium.toFixed(4)}`, color: "var(--secondary)" },
          { label: "Strike Price", value: `₹${K}`, color: "var(--text2)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ flex: 1, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 16, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "24px 8px 8px" }}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="price"
              tickFormatter={(v) => `₹${v}`}
              tick={{ fill: "var(--text3)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${v}`}
              tick={{ fill: "var(--text3)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "var(--text2)", paddingTop: 12 }}
            />
            {/* Zero line */}
            <ReferenceLine y={0} stroke="var(--border2)" strokeWidth={1.5} />
            {/* Strike line */}
            <ReferenceLine
              x={K} stroke="var(--text3)" strokeDasharray="4 4"
              label={{ value: `K=₹${K}`, fill: "var(--text3)", fontSize: 10, position: "top" }}
            />
            {/* Break-even line */}
            <ReferenceLine
              x={type === "call" ? K + premium : K - premium}
              stroke="var(--accent)" strokeDasharray="4 4" strokeWidth={1.5}
              label={{ value: "BE", fill: "var(--accent)", fontSize: 10, position: "top" }}
            />
            <Line
              type="monotone" dataKey="P&L at Expiry"
              stroke="var(--accent)" strokeWidth={2.5}
              dot={false} activeDot={{ r: 4, fill: "var(--accent)" }}
            />
            <Line
              type="monotone" dataKey="Current Value"
              stroke="#8856a7" strokeWidth={1.5}
              dot={false} strokeDasharray="5 3"
              activeDot={{ r: 4, fill: "#8856a7" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 24, fontSize: 11, color: "var(--text3)" }}>
        <span>— Solid line: P&L at expiry</span>
        <span>- - Dashed line: current theoretical value (with time remaining)</span>
      </div>
    </div>
  );
}

// ── Option Chain Table ────────────────────────────────
function OptionChain({ inputs }) {
  if (!inputs) return null;

  const { spotPrice: S, timeToExpiry: T, volatility: sigma, riskFreeRate: r } = inputs;

  // generate strikes ±20% around spot in steps
  const step = Math.round(S * 0.025 / 50) * 50 || 50;
  const strikes = [];
  for (let i = -8; i <= 8; i++) {
    strikes.push(Math.round((S + i * step) / step) * step);
  }

  const rows = strikes.map((K) => {
    const callPrice = bs(S, K, T, r, sigma, "call");
    const putPrice  = bs(S, K, T, r, sigma, "put");

    // delta approximation
    const callDelta = callPrice > 0
      ? parseFloat((bs(S+1, K, T, r, sigma, "call") - callPrice).toFixed(4))
      : 0;
    const putDelta = putPrice > 0
      ? parseFloat((bs(S+1, K, T, r, sigma, "put") - putPrice).toFixed(4))
      : 0;

    const moneyness = K < S ? "ITM" : K === S ? "ATM" : "OTM";
    const isATM = Math.abs(K - S) < step * 0.6;

    return { K, callPrice, putPrice, callDelta, putDelta, moneyness, isATM };
  });

  const thStyle = {
    padding: "10px 14px",
    fontSize: 10,
    color: "var(--text3)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 500,
    textAlign: "right",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg3)",
    whiteSpace: "nowrap",
  };

  const tdStyle = (align = "right", highlight = false, color = null) => ({
    padding: "10px 14px",
    fontSize: 13,
    textAlign: align,
    borderBottom: "1px solid var(--border)",
    color: color || (highlight ? "var(--accent)" : "var(--text)"),
    fontFamily: "var(--font-mono)",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          Option Chain
        </div>
        <div style={{ color: "var(--text3)", fontSize: 12 }}>
          All strikes · Spot: ₹{S} · Vol: {(sigma*100).toFixed(0)}% · T: {T}yr
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 11 }}>
        {[
          { label: "ITM", desc: "In The Money", color: "var(--accent)" },
          { label: "ATM", desc: "At The Money", color: "var(--blush)" },
          { label: "OTM", desc: "Out of The Money", color: "var(--text3)" },
        ].map(({ label, desc, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            <span style={{ color }}>{label}</span>
            <span style={{ color: "var(--text3)" }}>— {desc}</span>
          </div>
        ))}
      </div>

      <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {/* Call side */}
              <th style={{ ...thStyle, color: "var(--accent)", textAlign: "right" }}>Call Price</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Call Δ</th>
              {/* Strike */}
              <th style={{ ...thStyle, textAlign: "center", color: "var(--blush)", fontSize: 11 }}>
                STRIKE
              </th>
              {/* Put side */}
              <th style={{ ...thStyle, textAlign: "left" }}>Put Δ</th>
              <th style={{ ...thStyle, color: "var(--secondary)", textAlign: "left" }}>Put Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ K, callPrice, putPrice, callDelta, putDelta, moneyness, isATM }) => {
              const rowBg = isATM
                ? "rgba(233,188,185,0.06)"
                : K < S ? "rgba(237,158,89,0.04)" : "transparent";

              const strikeColor = isATM
                ? "var(--blush)"
                : K < S ? "var(--accent)" : "var(--text3)";

              return (
                <tr key={K} style={{ background: rowBg, transition: "background 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = rowBg}>

                  {/* Call Price */}
                  <td style={tdStyle("right", K < S)}>
                    ₹{callPrice.toFixed(4)}
                  </td>
                  {/* Call Delta */}
                  <td style={tdStyle("right", false, "var(--text2)")}>
                    {callDelta.toFixed(4)}
                  </td>

                  {/* Strike — center column */}
                  <td style={{
                    ...tdStyle("center"),
                    color: strikeColor,
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                    position: "relative",
                    borderLeft: "1px solid var(--border)",
                    borderRight: "1px solid var(--border)",
                    background: isATM ? "rgba(233,188,185,0.06)" : "var(--bg3)",
                  }}>
                    {isATM && (
                      <span style={{
                        position: "absolute", top: 2, right: 4,
                        fontSize: 8, color: "var(--blush)",
                        textTransform: "uppercase", letterSpacing: "0.1em",
                      }}>ATM</span>
                    )}
                    ₹{K}
                    <div style={{ fontSize: 9, color: strikeColor, opacity: 0.7, marginTop: 1, fontFamily: "var(--font-mono)", fontWeight: 400 }}>
                      {moneyness}
                    </div>
                  </td>

                  {/* Put Delta */}
                  <td style={tdStyle("left", false, "var(--text2)")}>
                    {putDelta.toFixed(4)}
                  </td>
                  {/* Put Price */}
                  <td style={tdStyle("left", K > S, "var(--secondary)")}>
                    ₹{putPrice.toFixed(4)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: "var(--text3)" }}>
        Call prices highlighted in amber (ITM) · Put prices highlighted in rose (ITM) · Δ = Delta approximation
      </div>
    </div>
  );
}

// ── Existing components ───────────────────────────────
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
      <div style={{ fontSize: 32, fontWeight: 500, color: accent ? "var(--accent)" : "var(--text)", marginBottom: 6 }}>
        ₹{typeof value === "number" ? value.toFixed(4) : value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--text3)" }}>{sub}</div>}
    </div>
  );
}

const defaultForm = {
  stockSymbol: "", spotPrice: "", strikePrice: "",
  timeToExpiry: "", volatility: "", riskFreeRate: "", optionType: "call",
};

// ── Tabs ──────────────────────────────────────────────
const TABS = ["Results", "Payoff Diagram", "Option Chain"];

// ── Main Dashboard ────────────────────────────────────
export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Results");

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

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null); setActiveTab("Results");
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
    { key: "vega",  label: "Vega",  desc: "Price change per 1% volatility shift" },
    { key: "rho",   label: "Rho",   desc: "Price change per 1% rate shift" },
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
                  <button key={s.symbol} onClick={() => handleStockSelect(s.symbol)} style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: 11,
                    border: `1px solid ${form.stockSymbol === s.symbol ? "var(--accent)" : "var(--border2)"}`,
                    background: form.stockSymbol === s.symbol ? "var(--accent-dim)" : "transparent",
                    color: form.stockSymbol === s.symbol ? "var(--accent)" : "var(--text2)",
                    transition: "var(--transition)",
                  }}>{s.symbol}</button>
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
              style={{ width: "100%", justifyContent: "center", marginTop: 4, color: "#1B1931" }}
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
              <div style={{ color: "var(--text2)", fontSize: 13 }}>Running 10,000 Monte Carlo simulations...</div>
            </div>
          )}

          {result && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {/* Tab bar */}
              <div style={{
                display: "flex", gap: 4, marginBottom: 24,
                borderBottom: "1px solid var(--border)", paddingBottom: 0,
              }}>
                {TABS.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: "8px 16px",
                    fontSize: 13,
                    borderRadius: "6px 6px 0 0",
                    border: "1px solid transparent",
                    borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                    background: "transparent",
                    color: activeTab === tab ? "var(--accent)" : "var(--text2)",
                    transition: "var(--transition)",
                    marginBottom: -1,
                  }}>{tab}</button>
                ))}
              </div>

              {/* ── Tab: Results ── */}
              {activeTab === "Results" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700 }}>
                        {result.stockSymbol} — {result.inputs.optionType.toUpperCase()} Option
                      </div>
                      <div style={{ color: "var(--text3)", fontSize: 12, marginTop: 4 }}>
                        S: ₹{result.inputs.spotPrice} · K: ₹{result.inputs.strikePrice} · T: {result.inputs.timeToExpiry}yr · σ: {(result.inputs.volatility*100).toFixed(0)}%
                      </div>
                    </div>
                    <span className="tag tag-green">✓ Calculated</span>
                  </div>

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

              {/* ── Tab: Payoff Diagram ── */}
              {activeTab === "Payoff Diagram" && (
                <PayoffDiagram inputs={result.inputs} results={result.results} />
              )}

              {/* ── Tab: Option Chain ── */}
              {activeTab === "Option Chain" && (
                <OptionChain inputs={result.inputs} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}