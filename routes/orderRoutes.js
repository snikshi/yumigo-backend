import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// 1. CREATE ORDER
router.post('/create', async (req, res) => {
  try {
    const { userId, items, totalPrice, paymentMethod } = req.body;
    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      paymentMethod,
      status: 'Placed'
    });
    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET USER ORDERS
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. UPDATE STATUS & MINT REWARDS (Eat-to-Earn Logic) 🟢
router.post('/update-status', async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Update Status
        order.status = status;
        await order.save();

        // 🟢 IF DELIVERED -> GIVE REWARDS
        if (status === 'Delivered') {
            const user = await User.findById(order.userId);
            if (user) {
                // Reward = 10% of order value in YUMI Tokens
                const rewardAmount = Math.floor(order.totalPrice * 0.01);
                
                user.yumiTokens += rewardAmount;
                
                user.transactions.push({
                    id: Date.now().toString(),
                    title: `Reward: Order #${order._id.toString().slice(-4)}`,
                    amount: rewardAmount,
                    type: 'credit',
                    isToken: true
                });
                
                await user.save();
                return res.json({ success: true, status: 'Delivered', rewardEarned: rewardAmount });
            }
        }

        res.json({ success: true, status });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;