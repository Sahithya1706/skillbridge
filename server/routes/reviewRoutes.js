const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviewsByGig,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);
// 🧑‍💼 Admin - Get all reviews
router.get("/", protect, getAllReviews);

router.get("/:gigId", getReviewsByGig);

module.exports = router;
