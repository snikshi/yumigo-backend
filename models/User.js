import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // 🟢 WEB3 WALLET
  walletAddress: { type: String, default: "" }, 
  walletPrivateKey: { type: String, select: false },

  // 🟢 BALANCES
  walletBalance: { type: Number, default: 0 }, // Fiat (₹)
  yumiTokens: { type: Number, default: 0 },    // Crypto (YUMI)

  // 🟢 HISTORY
  transactions: [{
    id: String,
    title: String,
    amount: Number,
    type: { type: String, enum: ['credit', 'debit'] },
    isToken: { type: Boolean, default: false }, // True if YUMI, False if ₹
    date: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);