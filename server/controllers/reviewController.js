const Review = require("../models/Review");
const Order = require("../models/Order"); // ✅ needed

// ⭐ POST REVIEW
exports.createReview = async (req, res) => {
  try {
    const { rating, comment, gigId } = req.body;

    // ✅ check if user has completed order for this gig
    const completedOrder = await Order.findOne({
      gig: gigId,
      buyer: req.user._id,
      status: "completed",
    });

    if (!completedOrder) {
      return res.status(400).json({
        message: "You can review only after completing the order",
      });
    }

    // ✅ prevent duplicate review
    const existingReview = await Review.findOne({
      gig: gigId,
      user: req.user._id,
    });

    if (existingReview) {
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
