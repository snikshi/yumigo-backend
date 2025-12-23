import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pickup: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  drop: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  price: { type: Number, required: true },
  status: { type: String, default: "Confirmed" }, // Confirmed, Completed, Cancelled
  driverName: { type: String, default: "Searching..." },
  carNumber: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Ride", rideSchema);