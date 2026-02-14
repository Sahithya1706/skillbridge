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
const upload = require("../middleware/upload");

// ⚠️ ORDER MATTERS

router.get("/my", protect, getMyGigsWithEarnings);

// ✅ multer MUST come before controller
router.post(
  "/",
  protect,
  upload.array("images", 3),
  createGig
);

router.put("/:id", protect, updateGig);
router.delete("/:id", protect, deleteGig);

router.get("/", getAllGigs);
router.get("/:id", getGigById);


module.exports = router;
