// server/seed/seedStocks.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Stock from "../models/Stock.js";

dotenv.config();

const stocks = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    currentPrice: 2450,
    volatility: 0.28,
    sector: "Energy & Conglomerate",
    riskFreeRate: 0.065,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    currentPrice: 3800,
    volatility: 0.22,
    sector: "Information Technology",
    riskFreeRate: 0.065,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    currentPrice: 1450,
    volatility: 0.25,
    sector: "Information Technology",
    riskFreeRate: 0.065,
  },
  {
    symbol: "NIFTY50",
    name: "Nifty 50 Index",
    currentPrice: 19500,
    volatility: 0.18,
    sector: "Index",
    riskFreeRate: 0.065,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    currentPrice: 1620,
    volatility: 0.20,
    sector: "Banking & Finance",
    riskFreeRate: 0.065,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    await Stock.deleteMany();
    console.log("Cleared existing stocks 🗑️");

    await Stock.insertMany(stocks);
    console.log("Sample stocks seeded successfully 🌱");

    console.table(
      stocks.map((s) => ({
        Symbol: s.symbol,
        Price: `₹${s.currentPrice}`,
        Volatility: `${(s.volatility * 100).toFixed(0)}%`,
        Sector: s.sector,
      }))
    );

    process.exit(0);
  } catch (error) {
    console.error("Seed failed ❌", error.message);
    process.exit(1);
  }
};

seedDB();