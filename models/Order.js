import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    
    // 👇 NEW FIELDS ADDED HERE
    rideId: { type: String, default: null }, // Links to the specific taxi ride
    scheduledFor: { type: Date, default: null }, // If "Hold" is active, this is the release time
    
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String }
      }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Preparing" }, // e.g., "Scheduled", "Preparing", "Delivered"
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;