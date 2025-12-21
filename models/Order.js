import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Who bought it?
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String }
      }
    ], // What did they buy?
    totalPrice: { type: Number, required: true }, // How much?
    status: { type: String, default: "Preparing" }, // Preparing -> On the Way -> Delivered
    date: { type: Date, default: Date.now } // When?
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;