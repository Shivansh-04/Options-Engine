// server/routes/history.routes.js

import express from "express";
import {
  getHistory,
  getCalculation,
  deleteCalculation,
} from "../controllers/history.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getHistory);
router.get("/:id", protect, getCalculation);
router.delete("/:id", protect, deleteCalculation);

export default router;