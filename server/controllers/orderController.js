const Order = require("../models/Order");

// CREATE ORDER (Dummy Payment)
exports.createOrder = async (req, res) => {
  try {
    const { gigId, sellerId, price } = req.body;

    const order = await Order.create({
      buyer: req.user._id,
      seller: sellerId,
      gig: gigId,
      price,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ORDERS (Client / Freelancer)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate("gig")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS (Freelancer only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ SAFETY: allow only valid transitions
    const allowedStatuses = ["pending", "in-progress", "completed", "canceled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only seller can update
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("ORDER STATUS UPDATE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
