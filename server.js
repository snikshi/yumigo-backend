import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config'; // Loads .env variables
import paymentRouter from "./routes/payment.js";

// Import the new Food Route
import foodRouter from "./routes/foodRoute.js";
import authRouter from "./routes/auth.js";
import partnerRouter from "./routes/partner.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
const app = express();

// --- SECURITY & MIDDLEWARE ---
app.use(helmet());
app.use(cors());
app.use(express.json()); // Accepts JSON data
app.set('trust proxy', 1);

// --- CONNECT ROUTES ---
app.use("/api/food", foodRouter); // <--- The new line connects here
app.use("/api/auth", authRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/partner", partnerRouter);
app.use("/api/restaurant",restaurantRouter);
app.use("/api/orders", orderRouter);
// --- RATE LIMITING ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests, please try again later."
});
app.use(limiter);

// --- DB CONNECTION ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL);
        console.log("Connected to MongoDB 🚀");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
}
connectDB();

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});