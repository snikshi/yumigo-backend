import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "Electronics", "Fashion"
    price: { type: Number, required: true },
    oldPrice: { type: Number }, // 👈 For the "50% OFF" psychology effect
    image: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, default: 4.5 },
    
    // 👇 The "Brain" part: Tags help us recommend similar items
    tags: [{ type: String }], // e.g., ["wireless", "bass", "music"]
    
    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;