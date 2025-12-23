import express from 'express';
import User from '../models/User.js'; // Note the .js at the end!
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // A. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // B. Check if password matches
    // (Note: In a real app, we would use encryption here. For now, we compare directly.)
    if (password !== user.password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // C. Success!
    res.status(200).json({ message: "Login Successful", user: user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👇 UPDATE USER DETAILS
router.put("/update", async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    // Find the user and update their details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true } // Return the updated data
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Could not update profile" });
  }
});

export default router;