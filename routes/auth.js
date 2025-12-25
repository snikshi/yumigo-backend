import express from 'express';
import User from '../models/User.js'; // Note the .js at the end!
import mongoose from "mongoose"; // 👈 Add this at the VERY TOP of the file
const router = express.Router();

// 1. REGISTER API
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create user
    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    res.status(201).json({ message: "User Created Successfully", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN API (This is the new part!)
// Inside router.post('/login', ...)

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    // 👇 1. CLEAN THE INPUT (Remove spaces)
   if (email) email = email.trim();
    console.log("🔍 Login Attempt for:", email); // Debug Log

    // A. Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(400).json({ message: "User not found. Please Register first." });
    }

    // ... rest of your code ...

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👇 UPDATE USER DETAILS
// 👇 UPDATE USER DETAILS

// 👇 ROBUST UPDATE ROUTE
router.put("/update", async (req, res) => {
  try {
    let { userId, name, email } = req.body;

    // 🧹 1. CLEAN THE ID (Remove hidden spaces)
    if (userId) userId = userId.trim();
    console.log("🔍 Searching for Clean ID:", userId);

    // 🛡️ 2. CHECK IF ID IS VALID MONGO FORMAT
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log("❌ Error: Invalid ID format");
        return res.status(400).json({ error: "Invalid User ID format" });
    }

    // 🔍 3. FIND AND UPDATE
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      console.log("❌ Error: ID valid but not found in DB.");
      return res.status(404).json({ error: "User not found in Database" });
    }

    console.log("✅ Success: Profile Updated for", updatedUser.name);
    res.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Server error during update" });
  }
});

export default router;