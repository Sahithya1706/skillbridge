const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviewsByGig,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// ⭐ Create review
router.post("/", protect, createReview);

// 📥 Get reviews by gig
router.get("/:gigId", getReviewsByGig);

module.exports = router;
