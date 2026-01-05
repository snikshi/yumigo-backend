import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  
  // 🟢 NEW: Web3 Wallet Fields
  walletAddress: { type: String, default: "" }, 
  walletPrivateKey: { type: String, select: false }, // 'select: false' hides it by default for security

  isGoldMember: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);