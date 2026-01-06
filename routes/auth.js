import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import rateLimit from 'express-rate-limit'; // 👈 1. Added Missing Import

const router = express.Router();

// 🔒 2. Define Limiter BEFORE using it
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per window
    message: "Too many login attempts, please try again later"
});

// Helper: Create a new Ethereum Wallet
const createWeb3Wallet = () => {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
};

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const cryptoWallet = createWeb3Wallet();

    const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword,
        walletAddress: cryptoWallet.address,
        walletPrivateKey: cryptoWallet.privateKey
    });
    
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ 
        success: true, 
        user: { 
            id: newUser._id, 
            name: newUser.name, 
            email: newUser.email, 
            walletAddress: newUser.walletAddress 
        }, 
        token 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN (With Rate Limiter applied)
// 👈 3. Applied middleware here. Removed the duplicate empty route at the bottom.
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        isGoldMember: user.isGoldMember
      },
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. UPDATE (Protected)
router.put("/update", async (req, res) => {
    const { userId, ...updates } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;