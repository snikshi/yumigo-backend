import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// 1. CREATE ORDER (You already have this)
router.post("/create", async (req, res) => {
  try {
    const { userId, items, totalPrice, status } = req.body;
    const newOrder = new Order({ userId, items, totalPrice, status });
    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 👇 2. GET USER HISTORY (Add this new part!)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // Get orders for this user, newest first
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch history" });
  }
});

export default router;