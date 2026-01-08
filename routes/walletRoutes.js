import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// 1. GET WALLET DATA (Balance + Tokens)
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            success: true,
            walletBalance: user.walletBalance, // Fiat
            yumiTokens: user.yumiTokens,       // Crypto
            walletAddress: user.walletAddress, // Web3 Address
            transactions: user.transactions
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. SWAP TOKENS TO CASH
router.post('/swap', async (req, res) => {
    try {
        const { userId, tokenAmount } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.yumiTokens < tokenAmount) return res.status(400).json({ message: "Insufficient Tokens" });

        // 💱 EXCHANGE RATE: 1 YUMI = ₹1
        const cashValue = tokenAmount * 1; 

        // Execute Swap
        user.yumiTokens -= tokenAmount;
        user.walletBalance += cashValue;

        // Record Transaction
        user.transactions.unshift({
            id: Date.now().toString(),
            title: `Swapped ${tokenAmount} YUMI`,
            amount: cashValue,
            type: 'credit',
            isToken: false, // Converted to Cash
            date: new Date()
        });

        await user.save();

        res.json({ 
            success: true, 
            message: `Successfully swapped ${tokenAmount} YUMI for ₹${cashValue}`,
            newBalance: user.walletBalance,
            newTokens: user.yumiTokens
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;