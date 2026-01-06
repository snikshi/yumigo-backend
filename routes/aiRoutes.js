import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    // 🛡️ SAFETY CHECK: Prevents 500 Crash
    if (!req.body || !req.body.message) {
        return res.status(200).json({ 
            reply: "Hi! I'm Yumi. How can I help? 🍔", 
            action: "none" 
        });
    }

    const { message, userId } = req.body;
    const lowerMsg = message.toLowerCase(); // Now safe to use
    
    let aiDecision = { text: "I'm thinking...", action: "none" };

    // ... (Keep your existing keyword logic here) ...
    if (lowerMsg.includes("pizza") || lowerMsg.includes("burger")) {
        aiDecision = { text: "Yum! Let me find that for you.", action: "search_food", query: lowerMsg };
    } 
    else {
        aiDecision = { text: "I can help you find food or check orders.", action: "none" };
    }
    // ...

    // EXECUTE ACTION
    let data = null;
    if (aiDecision.action === 'search_food') {
        const regex = new RegExp(aiDecision.query.split(" ")[0], 'i');
        data = await Product.find({ name: regex }).limit(5);
        if (data.length > 0) aiDecision.text = `Found ${data.length} options! 😋`;
        else aiDecision.text = "Searching...";
    } 

    res.json({ reply: aiDecision.text, action: aiDecision.action, data });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ reply: "My brain froze! 🥶" });
  }
});

export default router;