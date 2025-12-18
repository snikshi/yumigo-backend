const router = require('express').Router();
const Stripe = require('stripe');

// 👇 PASTE YOUR "sk_test_..." KEY HERE
const stripe = Stripe('sk_test_51Sfknu08capLH0moS6drp1DglMV9scBTSaiGRBXJbSFjlzVf3UcMV6V8opiEWPnkt210XQZiqkG4eFoWJgaNWWNi00AIRQDQ6H'); 

router.post('/intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 49900, // ₹499.00 (In paise)
      currency: 'inr', // We use Indian Rupees
      automatic_payment_methods: { enabled: true },
      description: 'Yumigo Food Order',
      shipping: {
        name: 'Test User',
        address: {
          line1: 'Hyderabad',
          city: 'Hyderabad',
          country: 'IN',
        },
      },
    });

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;