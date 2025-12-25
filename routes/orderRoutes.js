import express from "express";
import Order from "../models/Order.js";
import { calculateOrderTiming } from "../utils/rideSync.js"; // 👈 Import the logic

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { userId, items, totalPrice, rideId, rideDuration } = req.body; // 👈 Expect rideDuration from App

    let orderStatus = "Preparing";
    let scheduledTime = null;
    let syncMessage = "Order sent to kitchen!";

    // 👇 1. RUN SYNC LOGIC IF RIDE EXISTS
    if (rideId && rideDuration) {
      const syncResult = calculateOrderTiming(rideDuration); 
      
      if (syncResult.action === "HOLD") {
        orderStatus = "Scheduled";
        scheduledTime = syncResult.fireOrderAt;
        syncMessage = syncResult.message;
      }
    }

    // 👇 2. SAVE ORDER WITH NEW STATUS
    const newOrder = new Order({ 
        userId, 
        items, 
        totalPrice, 
        status: orderStatus,
        rideId,
        scheduledFor: scheduledTime
    });
    
    await newOrder.save();
    res.json({ success: true, order: newOrder, message: syncMessage });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET USER HISTORY (Keep your existing code here)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch history" });
  }
});

export default router;