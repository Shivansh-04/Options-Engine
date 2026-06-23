// server/index.js

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import pricingRoutes from "./routes/pricing.routes.js";
import historyRoutes from "./routes/history.routes.js";
import stockRoutes from "./routes/stock.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ── Routes ──────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/price", pricingRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/stocks", stockRoutes);

// ── Health Check ────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Options Pricing Engine API is running 🚀" });
});

// ── Global Error Handler ─────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🔥`);
  });
});