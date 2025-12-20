import express from 'express';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js'; // Make sure this name matches your file!

const router = express.Router();

// 1. REGISTER A NEW RESTAURANT
router.post('/register', async (req, res) => {
  try {
    const { ownerId, name, address, image, description } = req.body;
    
    // Create the restaurant
    const newRestaurant = new Restaurant({ ownerId, name, address, image, description });
    await newRestaurant.save();

    res.status(201).json({ success: true, message: "Restaurant Registered!", data: newRestaurant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. ADD FOOD TO MY RESTAURANT
router.post('/add-food', async (req, res) => {
  try {
    const { restaurantId, name, price, description, image, category } = req.body;

    const newFood = new Food({ restaurantId, name, price, description, image, category });
    await newFood.save();

    res.status(201).json({ success: true, message: "Menu Item Added!", data: newFood });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. GET MY RESTAURANT DETAILS (By Owner ID)
router.get('/my-restaurant/:ownerId', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.params.ownerId });
        if(!restaurant) return res.status(404).json({ success: false, message: "No restaurant found."});
        
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;