// server/routes/stock.routes.js

import express from "express";
import { getStocks, getStock } from "../controllers/stock.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/samples", protect, getStocks);
router.get("/samples/:symbol", protect, getStock);

export default router;