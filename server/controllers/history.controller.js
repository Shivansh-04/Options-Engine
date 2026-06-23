// server/controllers/history.controller.js

import Calculation from "../models/Calculation.js";

// ── Get All History for logged in user ───────────────
export const getHistory = async (req, res, next) => {
  try {
    const calculations = await Calculation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json(calculations);
  } catch (error) {
    next(error);
  }
};

// ── Get Single Calculation ────────────────────────────
export const getCalculation = async (req, res, next) => {
  try {
    const calculation = await Calculation.findById(req.params.id);

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" });
    }

    if (calculation.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(calculation);
  } catch (error) {
    next(error);
  }
};

// ── Delete Calculation ────────────────────────────────
export const deleteCalculation = async (req, res, next) => {
  try {
    const calculation = await Calculation.findById(req.params.id);

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" });
    }

    if (calculation.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await calculation.deleteOne();
    res.json({ message: "Calculation deleted successfully" });
  } catch (error) {
    next(error);
  }
};