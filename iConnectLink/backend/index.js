// backend/index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import Routes
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");
// const bookingRoutes = require("./routes/bookingRoutes");

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes); // registration POST here
// app.use("/api/bookings", bookingRoutes);

// ✅ Root API Test
app.get("/", (req, res) => {
  res.send("🎉 Backend API is running successfully!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
