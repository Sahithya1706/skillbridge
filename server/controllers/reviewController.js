const Review = require("../models/Review");

// ⭐ POST REVIEW
exports.createReview = async (req, res) => {
  try {
    const { rating, comment, gigId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ prevent duplicate review by same user on same gig
    const existingReview = await Review.findOne({
      gig: gigId,
      user: req.user._id,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this gig" });
    }

    const review = await Review.create({
      rating,
      comment,
      gig: gigId,
      user: req.user._id,
    });

    res.status(201).json(review);
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
