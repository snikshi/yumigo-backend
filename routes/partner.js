import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// 1. DASHBOARD STATS (Earnings & Orders)
router.get('/stats/:sellerId', async (req, res) => {
    try {
        // In a real app, filter by sellerId. For now, we show Global Stats for demo.
        const orders = await Order.find().sort({ createdAt: -1 });
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'Placed').length;
        const completedOrders = orders.filter(o => o.status === 'Delivered').length;

        res.json({
            success: true,
            stats: {
                revenue: totalRevenue,
                totalOrders: orders.length,
                pending: pendingOrders,
                completed: completedOrders
            },
            recentOrders: orders.slice(0, 5) // Send top 5 recent
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. ADD NEW PRODUCT (Food/Item)
router.post('/add-item', async (req, res) => {
    try {
        const { name, price, category, image, description, sellerId } = req.body;

        const newProduct = new Product({
            name,
            price,
            category, // e.g., "Biryani", "Pizza", "Electronics"
            image,
            description,
            rating: 4.5, // Default start rating
            sellerId: sellerId || "admin" 
        });

        await newProduct.save();
        res.json({ success: true, message: "Item added successfully!", product: newProduct });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE ORDER STATUS (Accept/Reject)
router.post('/update-order', async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: `Order marked as ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 👇 4. DRIVER: GET AVAILABLE ORDERS (Status = 'Preparing')
router.get('/available-orders', async (req, res) => {
    try {
        // Fetch orders that the restaurant has accepted ('Preparing')
        // These are the ones waiting for a driver.
        const orders = await Order.find({ status: 'Preparing' }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 👇 5. DRIVER: ACCEPT ORDER
router.post('/accept-order', async (req, res) => {
    try {
        const { orderId, driverId } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        
        // Prevent double booking
        if (order.status !== 'Preparing') {
            return res.status(400).json({ success: false, message: "Order already taken or invalid" });
        }

        // Assign Driver & Update Status
        order.status = 'Out for Delivery';
        order.driverId = driverId;
        await order.save();

        res.json({ success: true, message: "Order Accepted! 🛵" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;