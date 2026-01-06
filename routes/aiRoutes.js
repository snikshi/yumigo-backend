import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// 🤖 THE AI LOGIC
router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    const lowerMsg = message.toLowerCase();
    
    let aiDecision = { text: "I'm thinking...", action: "none" };

    // 1. SIMPLE KEYWORD DETECTION (Mock AI)
    if (lowerMsg.includes("pizza") || lowerMsg.includes("burger") || lowerMsg.includes("biryani") || lowerMsg.includes("cake")) {
        aiDecision = { text: "Yum! Let me find that for you.", action: "search_food", query: lowerMsg };
    } 
    else if (lowerMsg.includes("help") || lowerMsg.includes("support") || lowerMsg.includes("late")) {
        aiDecision = { text: "Checking your order status...", action: "support", query: "status" };
    } 
    else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
        aiDecision = { text: "Hello! I am Yumi. Hungry? 🍔", action: "none" };
    }
    else {
        aiDecision = { text: "I love food! Try asking for 'Spicy Biryani' or 'Help'.", action: "none" };
    }

    // 2. PERFORM ACTION
    let data = null;

    if (aiDecision.action === 'search_food') {
        // Search Database
        const regex = new RegExp(aiDecision.query.split(" ")[0], 'i');
        data = await Product.find({ name: regex }).limit(5);
        
        if (data.length > 0) {
            aiDecision.text = `Found ${data.length} yummy options! 😋`;
        } else {
            aiDecision.text = "I couldn't find exactly that, but I'm looking! 🤖";
        }
    } 
    else if (aiDecision.action === 'support') {
        // Check Last Order
        const lastOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });
        if (lastOrder) {
            aiDecision.text = `Your order from ${lastOrder.items[0].name} is currently: ${lastOrder.status || 'Preparing'}.`;
            data = lastOrder;
        } else {
            aiDecision.text = "You haven't ordered anything yet. Hungry? 🍕";
        }
    }

    // 3. SEND RESPONSE
    res.json({
        reply: aiDecision.text,
        action: aiDecision.action,
        data: data 
    });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ reply: "My brain froze! 🥶 Try again." });
  }
});

// FEEDBACK LOOP
router.post('/feedback', (req, res) => {
    console.log("AI Feedback received:", req.body);
    res.json({ success: true });
});

export default router;