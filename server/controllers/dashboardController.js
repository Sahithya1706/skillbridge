const Gig = require("../models/Gig");
const Order = require("../models/Order");
const Review = require("../models/Review");

const PLATFORM_COMMISSION = 0.1; // 10%

/* ===============================
   FREELANCER DASHBOARD
================================ */
const getFreelancerDashboard = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    // Total Gigs
    const totalGigs = await Gig.countDocuments({ user: freelancerId });

    // All Orders
    const orders = await Order.find({ seller: freelancerId })
      .populate("buyer", "name")
      .populate("gig", "title")
      .sort({ createdAt: -1 });

    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    );

    const activeOrders = orders.filter(
      (order) => order.status !== "completed"
    ).length;

    // 💰 Gross Earnings
    const grossEarnings = completedOrders.reduce(
      (acc, order) => acc + order.price,
      0
    );

    // 💰 Platform Revenue (10%)
    const platformRevenue = grossEarnings * PLATFORM_COMMISSION;

    // 💰 Net Earnings
    const totalEarnings = grossEarnings - platformRevenue;

    // ⭐ Rating Calculation
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
      grossEarnings,
      totalEarnings,
      platformRevenue,
      rating,
      reviewCount: reviews.length,
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
};

/* ===============================
   MONTHLY EARNINGS GRAPH
================================ */
const getMonthlyEarnings = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    const earnings = await Order.aggregate([
      {
        $match: {
          seller: freelancerId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(earnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Monthly earnings error" });
  }
};

module.exports = {
  getFreelancerDashboard,
  getMonthlyEarnings,
};
