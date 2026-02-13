const express = require("express");
const router = express.Router();

const {
  createGig,
  getAllGigs,
  getGigById,
  updateGig,
  deleteGig,
  getMyGigsWithEarnings,
} = require("../controllers/gigController");

const { protect } = require("../middleware/authMiddleware");

/* 🔥 IMPORTANT: ORDER MATTERS */

// Protected FIRST
router.get("/my", protect, getMyGigsWithEarnings);

router.post("/", protect, createGig);
router.put("/:id", protect, updateGig);
router.delete("/:id", protect, deleteGig);

// Public
router.get("/", getAllGigs);
router.get("/:id", getGigById);

module.exports = router;
