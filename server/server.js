const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalytics");

dotenv.config();
connectDB();

const app = express();

// HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "https://skillbridge-henna.vercel.app",
    methods: ["GET", "POST"],
  },
});

// MIDDLEWARE
// MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://skillbridge-henna.vercel.app",
    ],
    credentials: true,
  })
);

// 🔥 VERY IMPORTANT (FormData ke liye)
// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ ADMIN ROUTES (ONLY ONCE)
app.use("/api/admin", adminRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);

// SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("sendMessage", (message) => {
  socket.broadcast.emit("receiveMessage", message);
});


  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("SkillBridge API running");
});

// SERVER START
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


