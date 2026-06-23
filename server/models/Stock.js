// server/models/Stock.js

import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    volatility: {
      type: Number,
      required: true, // annualized, e.g. 0.28 = 28%
    },
    sector: {
      type: String,
    },
    riskFreeRate: {
      type: Number,
      default: 0.065, // India 10yr bond rate ~6.5%
    },
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);