import express from "express";
import Stripe from "stripe";

const router = express.Router();

// 🔑 PASTE YOUR SECRET KEY (sk_test_...) HERE
const stripe = new Stripe("sk_test_51Sfknu08capLH0moS6drp1DglMV9scBTSaiGRBXJbSFjlzVf3UcMV6V8opiEWPnkt210XQZiqkG4eFoWJgaNWWNi00AIRQDQ6H");

// 👇 Notice: This creates the "/intents" route the app is looking for!
router.post("/intents", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
    }

    // Ask Stripe for a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paise
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    // Send the secret key back to the App
    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (e) {
    console.log("Stripe Error:", e.message);
    res.status(400).json({ error: e.message });
  }
});

export default router;