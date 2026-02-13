const Review = require("../models/Review");

// ⭐ POST REVIEW
exports.createReview = async (req, res) => {
  try {
    const { rating, comment, gigId } = req.body;

    // ❌ prevent duplicate review
    const existing = await Review.findOne({
      gig: gigId,
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already reviewed this gig",
      });
    }

    const review = await Review.create({
      rating,
      comment,
      gig: gigId,
      user: req.user._id,
    });

    // ✅ populate user before sending response
    const populatedReview = await review.populate("user", "name");

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 GET REVIEWS BY GIG
exports.getReviewsByGig = async (req, res) => {
  try {
    const reviews = await Review.find({ gig: req.params.gigId })
      .populate("user", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
