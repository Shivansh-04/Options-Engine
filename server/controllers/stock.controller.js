// server/controllers/stock.controller.js

import Stock from "../models/Stock.js";

// ── Get All Sample Stocks ─────────────────────────────
export const getStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.find().select("-__v");
    res.json(stocks);
  } catch (error) {
    next(error);
  }
};

// ── Get Single Stock ──────────────────────────────────
export const getStock = async (req, res, next) => {
  try {
    const stock = await Stock.findOne({
      symbol: req.params.symbol.toUpperCase(),
    });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.json(stock);
  } catch (error) {
    next(error);
  }
};