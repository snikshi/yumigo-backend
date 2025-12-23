import express from "express";
import Ride from "../models/Ride.js";

const router = express.Router();

// 👇 1. BOOK A RIDE
router.post("/book", async (req, res) => {
  try {
    const { userId, pickup, drop, price } = req.body;

    // Simulate finding a driver randomly
    const randomDrivers = ["Raju (Swift)", "Vikram (Alto)", "Anita (Scooty)", "Mohammed (Auto)"];
    const assignedDriver = randomDrivers[Math.floor(Math.random() * randomDrivers.length)];

    const newRide = new Ride({
      userId,
      pickup,
      drop,
      price,
      driverName: assignedDriver,
      carNumber: "TS-" + Math.floor(1000 + Math.random() * 9000), // Random Plate
      status: "On the Way"
    });

    await newRide.save();
    res.json({ success: true, ride: newRide });

  } catch (error) {
    res.status(500).json({ error: "Booking Failed" });
  }
});

// 👇 2. GET RIDE HISTORY
router.get("/user/:userId", async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch rides" });
  }
});

export default router;