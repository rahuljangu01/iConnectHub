const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===================================================
// ✅ 1. Middlewares (Updated for Deployment)
// ===================================================

// This setup allows requests from ANY origin. For production, you might want to restrict this.
// For now, this is the easiest way to get it working.
app.use(cors({
    origin: "*", // Allows all origins
    methods: "GET,POST,PUT,DELETE", // Allows these HTTP methods
    credentials: true,
}));

app.use(express.json());

// ===================================================
// ✅ 2. MongoDB Connection (No changes needed here)
// ===================================================
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===================================================
// ✅ 3. Import Routes
// ===================================================
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");
const userRoutes = require("./routes/user.routes"); // For settings/password change

// ===================================================
// ✅ 4. Use Routes
// ===================================================
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/users", userRoutes); // Use the user routes

// ===================================================
// ✅ 5. Root API Test (Good for checking if the server is live)
// ===================================================
app.get("/", (req, res) => {
  res.send("🎉 Backend API for iCampusLink is running successfully!");
});

// ===================================================
// ✅ 6. Start Server (Updated for Deployment)
// ===================================================
// Render (or any deployment service) will set the PORT environment variable.
// If it's not set (like when you run it locally), it defaults to 5050.
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});