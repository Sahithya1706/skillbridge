const Gig = require("../models/Gig");

exports.createReview = async (req, res) => {
  try {
    const { rating, comment, gigId } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const review = await Review.create({
      rating,
      comment,
      gig: gigId,
      buyer: req.user._id,     // ✅ logged-in user
      seller: gig.user,        // ✅ gig owner
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
