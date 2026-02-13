const Gig = require("../models/Gig");
const Order = require("../models/Order");


// CREATE GIG (Freelancer only)
exports.createGig = async (req, res) => {
  try {
    const { title, description, price, category, images } = req.body;

    if (req.user.role !== "freelancer") {
      return res
        .status(403)
        .json({ message: "Only freelancers can create gigs" });
    }

    const gig = await Gig.create({
      title,
      description,
      price,
      category,
      images,
      user: req.user._id,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL GIGS (Public)
exports.getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().populate("user", "name email");
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE GIG
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE GIG (Owner only)
exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE GIG (Owner only)
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await gig.deleteOne();
    res.json({ message: "Gig removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET FREELANCER GIGS WITH EARNINGS
exports.getMyGigsWithEarnings = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    const gigs = await Gig.find({ user: freelancerId });

    const gigsWithEarnings = await Promise.all(
      gigs.map(async (gig) => {
        const completedOrders = await Order.find({
          gig: gig._id,
          status: "completed",
        });

        const earnings = completedOrders.reduce(
          (acc, order) => acc + order.price,
          0
        );

        return {
          ...gig.toObject(),
          earnings,
          ordersCount: completedOrders.length,
        };
      })
    );

    res.json(gigsWithEarnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
