// server/routes/pricing.routes.js

import express from "express";
import { calculate } from "../controllers/pricing.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/calculate", protect, calculate);

export default router;