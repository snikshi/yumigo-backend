import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// 1. CREATE NEW ORDER (When user clicks Checkout)
router.post("/create", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json({ success: true, data: savedOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET MY ORDERS (For Profile History)
// We will send the UserID, and the server gives back ONLY their orders
router.get("/myorders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ date: -1 }); // Newest first
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;