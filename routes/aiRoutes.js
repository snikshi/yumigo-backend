import express from 'express';
import OpenAI from 'openai';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// 🔒 Configure OpenAI (Get Key from .env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// The "Yumi" System Prompt
const SYSTEM_PROMPT = `
You are Yumi, the AI Concierge for Yumigo.
- Goal: Help users find food or resolve order issues.
- Tone: Friendly, witty, emoji-loving 🍔.
- Output: JSON format ONLY.
- Structure: { "text": "...", "action": "search_food" | "support" | "none", "query": "..." }
`;

router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    // 1. ASK THE LLM TO CLASSIFY THE INTENT
    // (If you don't have an OpenAI Key yet, use the Mock Logic below)
    
    /* // --- REAL AI LOGIC (Uncomment if you have Key) ---
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });
    const aiDecision = JSON.parse(completion.choices[0].message.content);
    */

    // --- MOCK LOGIC (For Testing without Cost) ---
    let aiDecision = { text: "I'm thinking...", action: "none" };
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes("pizza") || lowerMsg.includes("burger") || lowerMsg.includes("hungry")) {
        aiDecision = { text: "Yum! Let me find that for you.", action: "search_food", query: lowerMsg };
    } else if (lowerMsg.includes("help") || lowerMsg.includes("order") || lowerMsg.includes("late")) {
        aiDecision = { text: "Checking your recent orders...", action: "support", query: "status" };
    } else {
        aiDecision = { text: "I love talking about food! Try asking for 'Spicy Biryani'.", action: "none" };
    }
    // ---------------------------------------------

    // 2. EXECUTE THE ACTION
    let data = null;

    if (aiDecision.action === 'search_food') {
        // Search MongoDB for products
        const regex = new RegExp(aiDecision.query.split(" ")[0], 'i'); // Simple keyword match
        data = await Product.find({ name: regex }).limit(3);
        
        if (data.length > 0) {
            aiDecision.text = `Found ${data.length} yummy options for you! 😋`;
        } else {
            aiDecision.text = "I couldn't find exactly that, but I'm learning every day! 🤖";
        }
    } 
    
    else if (aiDecision.action === 'support') {
        // Check recent order status
        const lastOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });
        if (lastOrder) {
            aiDecision.text = `Your order from ${lastOrder.restaurantName} is currently: ${lastOrder.status}. Rider is on the way! 🚴`;
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

// 4. AUTO-UPGRADE (Feedback Loop)
router.post('/feedback', async (req, res) => {
    // In a real app, save this to a "TrainingData" collection
    const { query, response, rating } = req.body;
    console.log(`[AI TRAINING] User rated "${query}" -> "${rating} stars"`);
    res.json({ success: true, message: "I'm learning!" });
});

export default router;