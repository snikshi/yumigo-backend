import express from 'express';
import Restaurant from '../models/Restaurant.js'; // Make sure the .js is there!

const router = express.Router();

// 1. CREATE Restaurant (Matches your Seller Tab)
router.post('/create', async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json({ success: true, data: newRestaurant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. LIST Restaurants (For your App's Home Screen)
router.get('/list', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;