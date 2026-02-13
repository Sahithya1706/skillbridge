const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getAllUsers,
  toggleBanUser,
  deleteGig,
  getAllGigs,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/ban", protect, adminOnly, toggleBanUser);
router.get("/gigs", protect, adminOnly, getAllGigs);
router.delete("/gigs/:id", protect, adminOnly, deleteGig);

module.exports = router;
