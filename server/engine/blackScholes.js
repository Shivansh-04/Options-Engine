// server/engine/blackScholes.js

// ── Normal Distribution CDF (from scratch) ──────────
// Approximation using Abramowitz & Stegun method
const normalCDF = (x) => {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
};

// ── Normal Distribution PDF (from scratch) ──────────
const normalPDF = (x) => {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
};

// ── Black-Scholes Core ───────────────────────────────
// S = spot price
// K = strike price
// T = time to expiry in years
// r = risk free rate (e.g. 0.065)
// sigma = volatility (e.g. 0.28)
// type = "call" | "put"

export const blackScholes = (S, K, T, r, sigma, type = "call") => {
  if (T <= 0) {
    // option already expired
    const intrinsic =
      type === "call"
        ? Math.max(S - K, 0)
        : Math.max(K - S, 0);
    return { price: intrinsic, d1: 0, d2: 0 };
  }

  const d1 =
    (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) /
    (sigma * Math.sqrt(T));

  const d2 = d1 - sigma * Math.sqrt(T);

  let price;

  if (type === "call") {
    price =
      S * normalCDF(d1) -
      K * Math.exp(-r * T) * normalCDF(d2);
  } else {
    price =
      K * Math.exp(-r * T) * normalCDF(-d2) -
      S * normalCDF(-d1);
  }

  return {
    price: parseFloat(price.toFixed(4)),
    d1: parseFloat(d1.toFixed(6)),
    d2: parseFloat(d2.toFixed(6)),
  };
};

export { normalCDF, normalPDF };