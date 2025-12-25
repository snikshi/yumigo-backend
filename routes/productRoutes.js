import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// 1. ADD A PRODUCT (Admin)
router.post("/add", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ success: true, message: "Product Added!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET ALL PRODUCTS (The Feed)
router.get("/list", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Newest first
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch products" });
  }
});

// 3. SMART RECOMMENDATIONS (The "Brain") 🧠
// Finds products with the same category but NOT the same ID
router.get("/recommend/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const currentProduct = await Product.findById(id);
    
    if (!currentProduct) return res.status(404).json({ message: "Product not found" });

    // Find 4 items in the same category
    const recommendations = await Product.find({
      category: currentProduct.category,
      _id: { $ne: id } // Exclude current product
    }).limit(4);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Recommendation failed" });
  }
});

export default router;