const Review = require("../models/Review"); // make sure this exists

const getFreelancerDashboard = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    const totalGigs = await Gig.countDocuments({ user: freelancerId });

    const orders = await Order.find({ seller: freelancerId })
      .populate("buyer", "name")
      .populate("gig", "title")
      .sort({ createdAt: -1 });

    const activeOrders = orders.filter(
      (order) => order.status !== "completed"
    ).length;

    const totalEarnings = orders
      .filter((order) => order.status === "completed")
      .reduce((acc, order) => acc + order.price, 0);

    // ⭐ REAL RATING CALCULATION
    const reviews = await Review.find({ seller: freelancerId });

    const rating =
      reviews.length === 0
        ? 0
        : (
            reviews.reduce((acc, r) => acc + r.rating, 0) /
            reviews.length
          ).toFixed(1);

    res.json({
      totalGigs,
      activeOrders,
      totalEarnings,
      rating,
      reviewCount: reviews.length,
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
};
