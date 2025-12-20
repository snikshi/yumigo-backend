import express from 'express';
// import Order from '../models/Order.js'; // (Uncomment this if you have an Order model later)
const router = express.Router();

// MOCK PAYMENT ENDPOINT
router.post('/', async (req, res) => {
  try {
    const { cartItems, totalPrice, userId } = req.body;

    // TODO: In a real app, you would charge Stripe/Razorpay here.
    // For now, we just say "Success" and save the order.

    // const newOrder = new Order({ userId, items: cartItems, total: totalPrice });
    // await newOrder.save();

    res.status(200).json({ success: true, message: "Payment Successful!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;