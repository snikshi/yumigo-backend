import mongoose from 'mongoose';

// The Blueprint
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In real app, we encrypt this!
  phone: { type: String, default: '' },
  isGoldMember: { type: Boolean, default: false }, // For Yumigo Gold
  walletBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);