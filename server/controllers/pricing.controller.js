// server/controllers/pricing.controller.js

import { blackScholes } from "../engine/blackScholes.js";
import { calculateGreeks } from "../engine/greeks.js";
import { monteCarlo } from "../engine/monteCarlo.js";
import Calculation from "../models/Calculation.js";
import Stock from "../models/Stock.js";

export const calculate = async (req, res, next) => {
  try {
    const {
      stockSymbol,
      spotPrice,
      strikePrice,
      timeToExpiry,
      volatility,
      riskFreeRate,
      optionType,
    } = req.body;

    // ── Validation ──────────────────────────────────
    if (
      !spotPrice ||
      !strikePrice ||
      !timeToExpiry ||
      !volatility ||
      !riskFreeRate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const S = parseFloat(spotPrice);
    const K = parseFloat(strikePrice);
    const T = parseFloat(timeToExpiry);
    const r = parseFloat(riskFreeRate);
    const sigma = parseFloat(volatility);
    const type = optionType || "call";

    // ── Run All 3 Engines ───────────────────────────
    const bsResult = blackScholes(S, K, T, r, sigma, type);
    const greeksResult = calculateGreeks(S, K, T, r, sigma, type);
    const mcResult = monteCarlo(S, K, T, r, sigma, type, 10000);

    const results = {
      blackScholes: bsResult,
      greeks: greeksResult,
      monteCarlo: mcResult,
    };

    // ── Save to DB ──────────────────────────────────
    const calculation = await Calculation.create({
      user: req.user._id,
      stockSymbol: stockSymbol || "CUSTOM",
      inputs: { spotPrice: S, strikePrice: K, timeToExpiry: T, volatility: sigma, riskFreeRate: r, optionType: type },
      results,
    });

    res.status(201).json({
      id: calculation._id,
      stockSymbol: calculation.stockSymbol,
      inputs: calculation.inputs,
      results,
      createdAt: calculation.createdAt,
    });
  } catch (error) {
    next(error);
  }
};