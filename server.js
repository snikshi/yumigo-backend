const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Security Headers
const rateLimit = require('express-rate-limit'); // Anti-Spam
require('dotenv').config();
import foodRouter from "./routes/foodRoute.js";
const app = express();

// --- 1. SECURITY LAYERS (The Iron Dome) ---
app.use(helmet()); // Hides that you are using Express
app.use(cors());   // Allows the App to talk to Server
app.use(express.json()); // Accepts JSON data
app.set('trust proxy',1)
app.use("/api/food", foodRouter);

// Rate Limiting (Stops anyone from spamming the server)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later."
});
app.use('/api', limiter); // Apply to all API routes

// --- 2. DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔒 Secure Database Connection Established');
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
  }
};
connectDB();

// --- 3. ROUTES ---
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
  res.send('Yumigo Server is Running Securely! 🛡️');
});

// --- 4. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//payment
const paymentRoute = require('./routes/payment');
app.use('/api/payment', paymentRoute);