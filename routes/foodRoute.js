import express from "express";
import foodModel from "../models/foodModel.js";

const foodRouter = express.Router();

// Route to add food
foodRouter.post("/add", async (req, res) => {
    const food = new foodModel(req.body);
    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
});

// Route to get list of food
foodRouter.get("/list", async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
});
// 👇 GET MENU BY RESTAURANT ID (Corrected Names)
foodRouter.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    // We use 'foodModel' because that is what you imported on Line 2!
    const foodItems = await foodModel.find({ restaurantId: req.params.restaurantId });
    res.status(200).json({ success: true, data: foodItems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default foodRouter;