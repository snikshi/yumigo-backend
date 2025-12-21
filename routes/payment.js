import express from "express";
import Stripe from "stripe";

const router = express.Router();

// 🔑 PASTE YOUR STRIPE SECRET KEY HERE (sk_test_...)
const stripe = new Stripe("sk_test_51Sfknu08capLH0moS6drp1DglMV9scBTSaiGRBXJbSFjlzVf3UcMV6V8opiEWPnkt210XQZiqkG4eFoWJgaNWWNi00AIRQDQ6H");

router.post("/intents", async (req, res) => {
  try {
    // 1. Get the amount from the App
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
    }

    // 2. Create Payment Intent (Amount in paise: ₹100 = 10000)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    // 3. Send Client Secret to App
    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (e) {
    console.log("Stripe Error:", e.message);
    res.status(400).json({ error: e.message });
  }
});

export default router;