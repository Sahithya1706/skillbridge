const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  updateOrderStatus,

} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.put("/:id/status", protect, updateOrderStatus);


module.exports = router;
