import express from "express";
import Stripe from "stripe";

const router = express.Router();

// 🔒 Load from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/intents", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // paise
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (e) {
    console.log("Stripe Error:", e.message);
    res.status(400).json({ error: e.message });
  }
});

export default router;