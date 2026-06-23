// server/engine/greeks.js

import { normalCDF, normalPDF } from "./blackScholes.js";

// ── All 5 Greeks ─────────────────────────────────────
// Delta  → how much option price changes per ₹1 move in stock
// Gamma  → how much Delta changes per ₹1 move in stock
// Theta  → how much option price decays per day
// Vega   → how much option price changes per 1% change in volatility
// Rho    → how much option price changes per 1% change in interest rate

export const calculateGreeks = (S, K, T, r, sigma, type = "call") => {
  if (T <= 0) {
    return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
  }

  const sqrtT = Math.sqrt(T);

  const d1 =
    (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) /
    (sigma * sqrtT);

  const d2 = d1 - sigma * sqrtT;

  const pdf_d1 = normalPDF(d1);
  const discountFactor = Math.exp(-r * T);

  // ── Delta ──────────────────────────────────────────
  const delta =
    type === "call" ? normalCDF(d1) : normalCDF(d1) - 1;

  // ── Gamma (same for call and put) ──────────────────
  const gamma = pdf_d1 / (S * sigma * sqrtT);

  // ── Theta (per day, divide by 365) ─────────────────
  const thetaCall =
    (-(S * pdf_d1 * sigma) / (2 * sqrtT) -
      r * K * discountFactor * normalCDF(d2)) /
    365;

  const thetaPut =
    (-(S * pdf_d1 * sigma) / (2 * sqrtT) +
      r * K * discountFactor * normalCDF(-d2)) /
    365;

  const theta = type === "call" ? thetaCall : thetaPut;

  // ── Vega (per 1% change in volatility) ─────────────
  const vega = (S * pdf_d1 * sqrtT) / 100;

  // ── Rho (per 1% change in interest rate) ───────────
  const rhoCall =
    (K * T * discountFactor * normalCDF(d2)) / 100;

  const rhoPut =
    (-K * T * discountFactor * normalCDF(-d2)) / 100;

  const rho = type === "call" ? rhoCall : rhoPut;

  return {
    delta: parseFloat(delta.toFixed(6)),
    gamma: parseFloat(gamma.toFixed(6)),
    theta: parseFloat(theta.toFixed(6)),
    vega:  parseFloat(vega.toFixed(6)),
    rho:   parseFloat(rho.toFixed(6)),
  };
};