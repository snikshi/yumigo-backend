import express from "express";
import Stripe from "stripe";

const router = express.Router();

// 🔑 PASTE YOUR STRIPE SECRET KEY HERE (sk_test_...)
const stripe = new Stripe("sk_test_51Sfknu08capLH0moS6drp1DglMV9scBTSaiGRBXJbSFjlzVf3UcMV6V8opiEWPnkt210XQZiqkG4eFoWJgaNWWNi00AIRQDQ6H");

// 👇 Notice this is "/intents" now, not "/"
router.post("/intents", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
    }

    // Create Payment Intent
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