const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getFreelancerDashboard,
  getMonthlyEarnings,
} = require("../controllers/dashboardController");

// Freelancer dashboard main data
router.get("/freelancer", protect, getFreelancerDashboard);

// Monthly earnings chart
router.get(
  "/freelancer/monthly-earnings",
  protect,
  getMonthlyEarnings
);

module.exports = router;
