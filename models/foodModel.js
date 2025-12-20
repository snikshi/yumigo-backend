import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }, // <--- ADD THIS LINE
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // URL of the food photo
  category: { type: String }, // e.g., "Burger", "Pizza"
});

export default mongoose.model('Food', foodSchema);