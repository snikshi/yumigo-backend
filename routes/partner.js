import express from "express";
import Order from "../models/Order.js"; // 👈 Make sure we import the Order model

const router = express.Router();

// 👇 GET ALL ORDERS WAITING FOR A DRIVER
router.get("/available-orders", async (req, res) => {
  try {
    // Find orders where status is "Preparing"
    // (In a real app, you'd also filter by location/city)
    const orders = await Order.find({ status: "Preparing" }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

// 👇 DRIVER ACCEPTS AN ORDER
router.post("/accept-order", async (req, res) => {
  try {
    const { orderId, driverId } = req.body;

    // Update status to "On the Way" and assign the driver
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        status: "On the Way", 
        driverId: driverId 
      },
      { new: true } // Return the updated version
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ error: "Could not accept order" });
  }
});

export default router;