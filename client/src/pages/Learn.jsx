// src/pages/Learn.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

// ── Section wrapper ──────────────────────────────────
function Section({ number, title, children }) {
  return (
    <div style={{
      marginBottom: 64,
      animation: "fadeUp 0.5s ease both",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "var(--accent-dim)",
          border: "1px solid var(--accent-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-head)", color: "var(--accent)",
          fontSize: 14, fontWeight: 700, flexShrink: 0,
        }}>{number}</div>
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 700 }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

// ── Callout box ──────────────────────────────────────
function Callout({ emoji, title, children, color = "var(--accent)" }) {
  return (
    <div style={{
      background: "var(--bg2)",
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      padding: "16px 20px",
      marginTop: 16,
    }}>
      {title && (
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 600, marginBottom: 8, color }}>
          {emoji} {title}
        </div>
      )}
      <div style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

// ── Comparison table ─────────────────────────────────
function CompareTable({ rows }) {
  return (
    <div style={{ overflowX: "auto", marginTop: 16 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {["", "Call Option", "Put Option"].map((h, i) => (
              <th key={i} style={{
                padding: "10px 16px",
                textAlign: "left",
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                color: i === 0 ? "var(--text3)" : i === 1 ? "var(--accent)" : "var(--secondary)",
                fontFamily: "var(--font-head)",
                fontSize: 12,
                letterSpacing: "0.04em",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: "10px 16px",
                  border: "1px solid var(--border)",
                  background: j === 0 ? "var(--bg3)" : "var(--bg2)",
                  color: j === 0 ? "var(--text3)" : "var(--text)",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Greek card ───────────────────────────────────────
function GreekExplainer({ symbol, name, color, simple, formula, example }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{
      cursor: "pointer",
      border: `1px solid ${open ? "var(--accent-border)" : "var(--border)"}`,
      transition: "var(--transition)",
    }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: `${color}18`,
            border: `1px solid ${color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color,
          }}>{symbol}</div>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15 }}>{name}</div>
            <div style={{ color: "var(--text2)", fontSize: 12, marginTop: 2 }}>{simple}</div>
          </div>
        </div>
        <div style={{ color: "var(--text3)", fontSize: 12 }}>{open ? "▲ hide" : "▼ show more"}</div>
      </div>

      {open && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", animation: "fadeIn 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Formula sense
              </div>
              <div style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7 }}>{formula}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Real example
              </div>
              <div style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7 }}>{example}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Interactive scenario ─────────────────────────────
function Scenario() {
  const scenarios = [
    {
      label: "Bull Market",
      desc: "You think RELIANCE will go UP from ₹2450 to ₹2700",
      action: "Buy a CALL option at Strike ₹2500",
      outcome: "If it hits ₹2700 → you buy at ₹2500 → profit ₹200 per share",
      loss: "If it stays below ₹2500 → you lose only the premium (e.g. ₹132)",
      type: "call",
    },
    {
      label: "Bear Market",
      desc: "You think INFY will FALL from ₹1450 to ₹1200",
      action: "Buy a PUT option at Strike ₹1400",
      outcome: "If it drops to ₹1200 → you sell at ₹1400 → profit ₹200 per share",
      loss: "If it stays above ₹1400 → you lose only the premium",
      type: "put",
    },
    {
      label: "Hedge Your Portfolio",
      desc: "You own HDFCBANK shares worth ₹1620 each and fear a crash",
      action: "Buy PUT options as insurance",
      outcome: "If stock crashes to ₹1200 → your PUT gains offset the loss",
      loss: "If stock rises → PUTs expire worthless, you keep the upside",
      type: "put",
    },
  ];

  const [active, setActive] = useState(0);
  const s = scenarios[active];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {scenarios.map((sc, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 12,
            border: `1px solid ${active === i ? "var(--accent-border)" : "var(--border2)"}`,
            background: active === i ? "var(--accent-dim)" : "transparent",
            color: active === i ? "var(--accent)" : "var(--text2)",
            transition: "var(--transition)",
          }}>{sc.label}</button>
        ))}
      </div>

      <div className="card" style={{
        borderTop: `2px solid ${s.type === "call" ? "var(--accent)" : "var(--secondary)"}`,
        animation: "fadeIn 0.3s ease",
      }}>
        <p style={{ color: "var(--text2)", marginBottom: 16, fontSize: 14, lineHeight: 1.7 }}>
          📊 <strong style={{ color: "var(--text)" }}>Situation:</strong> {s.desc}
        </p>
        <p style={{ color: "var(--text2)", marginBottom: 12, fontSize: 14, lineHeight: 1.7 }}>
          🎯 <strong style={{ color: "var(--text)" }}>Strategy:</strong> {s.action}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <div style={{
            background: "rgba(237,158,89,0.08)", border: "1px solid rgba(237,158,89,0.2)",
            borderRadius: 8, padding: "12px 16px",
          }}>
            <div style={{ fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              ✅ If you're right
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{s.outcome}</div>
          </div>
          <div style={{
            background: "rgba(163,64,84,0.08)", border: "1px solid rgba(163,64,84,0.2)",
            borderRadius: 8, padding: "12px 16px",
          }}>
            <div style={{ fontSize: 10, color: "var(--secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              ❌ If you're wrong
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{s.loss}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Monte Carlo viz ───────────────────────────────────
function MCViz() {
  const paths = [
    [2450, 2480, 2510, 2560, 2520, 2590, 2640],
    [2450, 2420, 2390, 2410, 2380, 2350, 2310],
    [2450, 2470, 2450, 2480, 2520, 2510, 2540],
    [2450, 2500, 2540, 2510, 2480, 2460, 2430],
    [2450, 2430, 2460, 2500, 2550, 2600, 2680],
  ];
  const colors = ["#ED9E59", "#A34054", "#E9BCB9", "#8856a7", "#c47a3b"];
  const minVal = 2280, maxVal = 2700, width = 500, height = 160;

  const toX = (i) => (i / 6) * width;
  const toY = (v) => height - ((v - minVal) / (maxVal - minVal)) * height;
  const toPath = (pts) => pts.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
        5 sample paths out of 10,000 simulated
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
        {/* Strike line */}
        <line x1={0} y1={toY(2500)} x2={width} y2={toY(2500)}
          stroke="rgba(237,158,89,0.3)" strokeWidth={1} strokeDasharray="4 4" />
        <text x={4} y={toY(2500) - 4} fill="rgba(237,158,89,0.6)" fontSize={9}>
          Strike ₹2500
        </text>
        {paths.map((pts, i) => (
          <path key={i} d={toPath(pts)} fill="none"
            stroke={colors[i]} strokeWidth={1.5} opacity={0.7} />
        ))}
        {/* Start dot */}
        <circle cx={0} cy={toY(2450)} r={3} fill="var(--accent)" />
      </svg>
      <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>
        Each path = one possible future. Average the payoffs → option price.
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────
export default function Learn() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: 56, animation: "fadeUp 0.5s ease" }}>
        <div className="tag tag-green" style={{ marginBottom: 16 }}>
          📖 Beginner's Guide
        </div>
        <h1 style={{
          fontFamily: "var(--font-head)", fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 16,
        }}>
          Options trading,<br />
          <span style={{ color: "var(--accent)" }}>explained simply.</span>
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.8, maxWidth: 560 }}>
          No finance degree needed. This page walks you through everything — from what an option is, to how our engine prices it using real mathematics.
        </p>
      </div>

      {/* ── 1. What is an option ── */}
      <Section number="01" title="What is a Stock Option?">
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          Imagine you're eyeing a house worth <strong style={{ color: "var(--text)" }}>₹50 lakhs</strong> today. You think the price will rise in 3 months, but you're not ready to buy yet.
        </p>
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          You pay the owner <strong style={{ color: "var(--text)" }}>₹1 lakh</strong> to "lock in" the right to buy it at ₹50 lakhs — even if the market price rises to ₹70 lakhs later.
        </p>
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8 }}>
          That ₹1 lakh you paid? That's the <strong style={{ color: "var(--accent)" }}>option premium</strong>. And that agreement? That's an <strong style={{ color: "var(--accent)" }}>option contract</strong>.
        </p>

        <Callout emoji="💡" title="In stock markets">
          Replace "house" with a stock like RELIANCE, and "owner" with a broker. You pay a small premium upfront for the <em>right</em> — not the obligation — to buy or sell shares at a fixed price before a deadline.
        </Callout>
      </Section>

      {/* ── 2. Call vs Put ── */}
      <Section number="02" title="Call vs Put Options">
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
          There are two types of options. Think of them as two different bets:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ borderTop: "2px solid var(--accent)" }}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700, color: "var(--accent)", marginBottom: 10 }}>
              📈 Call Option
            </div>
            <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7 }}>
              Right to <strong style={{ color: "var(--text)" }}>BUY</strong> shares at a fixed price.<br /><br />
              You buy a Call when you think the stock will <strong style={{ color: "var(--accent)" }}>go UP</strong>.
            </p>
            <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--bg3)", borderRadius: 6, fontSize: 12, color: "var(--text3)" }}>
              "I think TCS will rise. I'll lock in today's price."
            </div>
          </div>
          <div className="card" style={{ borderTop: "2px solid var(--secondary)" }}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700, color: "var(--secondary)", marginBottom: 10 }}>
              📉 Put Option
            </div>
            <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7 }}>
              Right to <strong style={{ color: "var(--text)" }}>SELL</strong> shares at a fixed price.<br /><br />
              You buy a Put when you think the stock will <strong style={{ color: "var(--secondary)" }}>go DOWN</strong>.
            </p>
            <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--bg3)", borderRadius: 6, fontSize: 12, color: "var(--text3)" }}>
              "I fear INFY will crash. I'll protect myself."
            </div>
          </div>
        </div>

        <CompareTable rows={[
          ["You profit when", "Stock goes UP ↑", "Stock goes DOWN ↓"],
          ["Max loss", "Premium paid only", "Premium paid only"],
          ["Max gain", "Unlimited (theoretically)", "Limited (stock can't go below 0)"],
          ["Used for", "Speculation, leverage", "Hedging, protection"],
        ]} />
      </Section>

      {/* ── 3. Key terms ── */}
      <Section number="03" title="Key Terms (Plain English)">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { term: "Spot Price (S)", def: "The current price of the stock RIGHT NOW. RELIANCE is trading at ₹2450 today → S = 2450." },
            { term: "Strike Price (K)", def: "The price you agreed to buy/sell at. If you lock in ₹2500 for RELIANCE → K = 2500. This is fixed in your contract." },
            { term: "Time to Expiry (T)", def: "How long your option is valid. 3 months = 0.25 years. After this date, the option expires worthless if unused." },
            { term: "Volatility (σ)", def: "How wildly the stock moves. A calm stock like HDFCBANK has ~20% volatility. A rollercoaster stock might be 50%+. Higher volatility = more expensive options." },
            { term: "Risk-Free Rate (r)", def: "India's 10-year government bond rate (~6.5%). The 'safe' return you could earn by just investing in bonds. Used as the baseline." },
            { term: "Premium", def: "The price you pay for the option contract. This is what our engine calculates. If BS says ₹132, that's what you'd pay per share." },
          ].map(({ term, def }) => (
            <div key={term} style={{
              display: "grid", gridTemplateColumns: "200px 1fr",
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: 8, overflow: "hidden",
            }}>
              <div style={{
                padding: "12px 16px",
                background: "var(--bg3)",
                borderRight: "1px solid var(--border)",
                fontFamily: "var(--font-head)", fontSize: 13,
                fontWeight: 600, color: "var(--accent)",
                display: "flex", alignItems: "center",
              }}>{term}</div>
              <div style={{ padding: "12px 16px", color: "var(--text2)", fontSize: 13, lineHeight: 1.6 }}>{def}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. Real scenarios ── */}
      <Section number="04" title="Real World Scenarios">
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
          Let's see how people actually use options. Click a scenario:
        </p>
        <Scenario />
      </Section>

      {/* ── 5. Black-Scholes ── */}
      <Section number="05" title="Black-Scholes — The Formula">
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          In 1973, Fischer Black and Myron Scholes published a formula that revolutionized finance. It lets you calculate the <em>fair price</em> of an option mathematically. They won the Nobel Prize for it.
        </p>
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
          The core idea: a stock price doesn't move randomly — it follows a pattern called <strong style={{ color: "var(--text)" }}>Geometric Brownian Motion</strong>. Like a drunk man walking, but always trending slightly upward.
        </p>

        <div className="card" style={{ background: "var(--bg3)", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            The formula (simplified)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font-mono)", fontSize: 13 }}>
            <div style={{ color: "var(--text2)" }}>
              Call Price = <span style={{ color: "var(--accent)" }}>S × N(d1)</span> − <span style={{ color: "var(--blush)" }}>K × e^(−rT) × N(d2)</span>
            </div>
            <div style={{ color: "var(--text3)", fontSize: 11, lineHeight: 1.8 }}>
              Where N() = Normal CDF (probability), d1 and d2 are intermediate values<br />
              encoding spot price, strike, time, volatility, and interest rate together.
            </div>
          </div>
        </div>

        <Callout emoji="🧮" title="What our engine does">
          We implement the Normal CDF from scratch using the Abramowitz & Stegun approximation — no math library. Same formula used by every trading desk on Wall Street, running on our Node.js server.
        </Callout>
      </Section>

      {/* ── 6. Greeks ── */}
      <Section number="06" title="The Greeks — Risk Dashboard">
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
          The Greeks tell you <em>how sensitive</em> your option's price is to different factors. Traders use these to manage risk. Click any Greek to learn more:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <GreekExplainer
            symbol="Δ" name="Delta" color="#ED9E59"
            simple="How much does option price move when stock moves ₹1?"
            formula="Partial derivative of option price with respect to spot price S. For calls: always between 0 and 1. For puts: always between -1 and 0."
            example="RELIANCE Call has Delta = 0.52. Stock goes from ₹2450 → ₹2451. Your option goes from ₹132.20 → ₹132.72. You gained ₹0.52."
          />
          <GreekExplainer
            symbol="Γ" name="Gamma" color="#A34054"
            simple="How fast does Delta itself change?"
            formula="Second derivative of option price with respect to S. Tells you how unstable your Delta is. High Gamma = Delta can change rapidly."
            example="Gamma = 0.0012. If stock moves ₹1, your Delta changes by 0.0012. So Delta goes from 0.5167 to 0.5179 after a ₹1 move."
          />
          <GreekExplainer
            symbol="Θ" name="Theta" color="#E9BCB9"
            simple="How much value does the option lose each day just by time passing?"
            formula="Partial derivative with respect to time T, divided by 365 for daily decay. Always negative — options lose value as expiry approaches."
            example="Theta = -0.95. Your RELIANCE call loses ₹0.95 in value every single day even if the stock doesn't move."
          />
          <GreekExplainer
            symbol="ν" name="Vega" color="#ED9E59"
            simple="How much does the option price change if volatility changes by 1%?"
            formula="Partial derivative with respect to volatility σ, divided by 100. Not a Greek letter — named Vega by convention. Same for calls and puts."
            example="Vega = 4.88. If RELIANCE volatility jumps from 28% to 29%, your option gains ₹4.88 in value. Volatility spikes help option holders."
          />
          <GreekExplainer
            symbol="ρ" name="Rho" color="#A34054"
            simple="How much does option price change if interest rates change by 1%?"
            formula="Partial derivative with respect to risk-free rate r. Least important Greek in practice. Positive for calls, negative for puts."
            example="Rho = 2.83. If RBI hikes interest rates by 1% (0.065 → 0.075), your call option gains ₹2.83 in theoretical value."
          />
        </div>
      </Section>

      {/* ── 7. Monte Carlo ── */}
      <Section number="07" title="Monte Carlo Simulation">
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          Instead of a formula, what if we just <em>simulated</em> thousands of possible futures and averaged the result?
        </p>
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          That's Monte Carlo. Named after the casino because it's based on randomness — but controlled, mathematical randomness.
        </p>

        <Callout emoji="🎲" title="How it works — step by step">
          <ol style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            <li>Generate a random number (using Box-Muller transform for normal distribution)</li>
            <li>Simulate where RELIANCE's stock price could be at expiry using Geometric Brownian Motion</li>
            <li>Calculate the option payoff for that simulated price</li>
            <li>Repeat 10,000 times</li>
            <li>Average all payoffs and discount back to today's value → <strong style={{ color: "var(--accent)" }}>that's your option price</strong></li>
          </ol>
        </Callout>

        <MCViz />

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="card">
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>Black-Scholes gives</div>
            <div style={{ fontSize: 20, color: "var(--accent)" }}>₹132.1994</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Exact, closed-form</div>
          </div>
          <div className="card">
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>Monte Carlo gives</div>
            <div style={{ fontSize: 20, color: "var(--blush)" }}>₹133.91 ± 2.17</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Statistical, approximate</div>
          </div>
        </div>
        <p style={{ color: "var(--text3)", fontSize: 12, marginTop: 12 }}>
          Both methods reach nearly the same answer — this validates our math engine. ✓
        </p>
      </Section>

      {/* ── CTA ── */}
      <div style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 40,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>Ω</div>
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
          Ready to try it yourself?
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>
          Use real Indian stocks with pre-loaded data. See all three engines fire in real time.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link to="/register" className="btn btn-primary" style={{ color: "#1B1931", fontSize: 14 }}>
            Start Calculating →
          </Link>
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: 14 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}