// server/engine/monteCarlo.js

// ── Box-Muller Transform ─────────────────────────────
// Converts uniform random numbers to standard normal distribution
// Z ~ N(0,1) from scratch — no library
const randomNormal = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

// ── Monte Carlo Simulation ───────────────────────────
// Simulates 10,000 possible stock price paths
// Uses Geometric Brownian Motion (GBM):
// S_T = S * exp((r - σ²/2)T + σ√T * Z)

export const monteCarlo = (
  S,
  K,
  T,
  r,
  sigma,
  type = "call",
  simulations = 10000
) => {
  if (T <= 0) {
    const intrinsic =
      type === "call"
        ? Math.max(S - K, 0)
        : Math.max(K - S, 0);
    return {
      price: intrinsic,
      simulations,
      standardError: 0,
    };
  }

  const payoffs = [];

  for (let i = 0; i < simulations; i++) {
    // generate random stock price at expiry using GBM
    const Z = randomNormal();
    const S_T =
      S *
      Math.exp(
        (r - (sigma * sigma) / 2) * T + sigma * Math.sqrt(T) * Z
      );

    // calculate payoff at expiry
    const payoff =
      type === "call"
        ? Math.max(S_T - K, 0)
        : Math.max(K - S_T, 0);

    payoffs.push(payoff);
  }

  // discount average payoff back to present value
  const discountFactor = Math.exp(-r * T);
  const meanPayoff =
    payoffs.reduce((sum, p) => sum + p, 0) / simulations;
  const price = discountFactor * meanPayoff;

  // standard error — measures accuracy of simulation
  const variance =
    payoffs.reduce((sum, p) => sum + Math.pow(p - meanPayoff, 2), 0) /
    simulations;
  const standardError =
    discountFactor * Math.sqrt(variance / simulations);

  return {
    price: parseFloat(price.toFixed(4)),
    simulations,
    standardError: parseFloat(standardError.toFixed(6)),
  };
};