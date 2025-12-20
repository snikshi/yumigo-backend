import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to the User who owns it
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // URL of the restaurant cover photo
  address: { type: String, required: true },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Restaurant', restaurantSchema);