const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// 📊 USERS GROWTH (month-wise)
router.get("/users-growth", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Users analytics error" });
  }
});

// 💰 REVENUE GROWTH (month-wise)
router.get("/revenue-growth", protect, adminOnly, async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      {
        $match: { status: "completed" }, // 🔥 only completed orders
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ message: "Revenue analytics error" });
  }
});

module.exports = router;
