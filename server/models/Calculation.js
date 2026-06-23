// server/models/Calculation.js

import mongoose from "mongoose";

const calculationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockSymbol: {
      type: String,
      required: true,
    },
    inputs: {
      spotPrice: Number,       // current stock price (S)
      strikePrice: Number,     // price at which option can be exercised (K)
      timeToExpiry: Number,    // in years (T)
      volatility: Number,      // annualized volatility (σ)
      riskFreeRate: Number,    // risk free interest rate (r)
      optionType: {
        type: String,
        enum: ["call", "put"],
        default: "call",
      },
    },
    results: {
      blackScholes: {
        price: Number,
        d1: Number,
        d2: Number,
      },
      greeks: {
        delta: Number,
        gamma: Number,
        theta: Number,
        vega: Number,
        rho: Number,
      },
      monteCarlo: {
        price: Number,
        simulations: Number,
        standardError: Number,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Calculation", calculationSchema);