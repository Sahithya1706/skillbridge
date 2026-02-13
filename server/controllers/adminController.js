const User = require("../models/User");
const Gig = require("../models/Gig");
const Order = require("../models/Order");

const PLATFORM_COMMISSION = 0.1;

/* =============================
   ADMIN DASHBOARD
============================= */
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGigs = await Gig.countDocuments();
    const totalOrders = await Order.countDocuments();

    const completedOrders = await Order.find({ status: "completed" });

    const grossRevenue = completedOrders.reduce(
      (acc, order) => acc + order.price,
      0
    );

    const platformRevenue = grossRevenue * PLATFORM_COMMISSION;

    res.json({
      totalUsers,
      totalGigs,
      totalOrders,
      grossRevenue,
      platformRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Admin dashboard error" });
  }
};

/* =============================
   GET ALL USERS
============================= */
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/* =============================
   BAN / UNBAN USER
============================= */
const toggleBanUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBanned = !user.isBanned;
  await user.save();

  res.json({ message: "User status updated" });
};

/* =============================
   GET ALL GIGS
============================= */
const getAllGigs = async (req, res) => {
  const gigs = await Gig.find().populate("user", "name email");
  res.json(gigs);
};

/* =============================
   DELETE GIG
============================= */
const deleteGig = async (req, res) => {
  await Gig.findByIdAndDelete(req.params.id);
  res.json({ message: "Gig deleted by admin" });
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  toggleBanUser,
  deleteGig,
  getAllGigs,
};
