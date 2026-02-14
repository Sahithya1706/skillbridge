const Review = require("../models/Review");
const Gig = require("../models/Gig");

// ⭐ POST REVIEW
const createReview = async (req, res) => {
  try {
    const { rating, comment, gigId } = req.body;

    if (!rating || !comment || !gigId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gig = await Gig.findById(gigId).populate("user");
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const review = await Review.create({
      rating,
      comment,
      gig: gigId,
      buyer: req.user._id,     // ✅ REQUIRED
      seller: gig.user._id,    // ✅ REQUIRED
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Review error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📥 GET REVIEWS BY GIG
const getReviewsByGig = async (req, res) => {
  try {
    const reviews = await Review.find({ gig: req.params.gigId })
      .populate("buyer", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧑‍💼 GET ALL REVIEWS (ADMIN)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("gig", "title price");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByGig,
  getAllReviews,
};
