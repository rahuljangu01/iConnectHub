const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // ✅ Add JWT
const User = require("../models/User");

const router = express.Router();

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, role, collegeId } = req.body;
  console.log("➡️ Signup API hit");
  console.log("📩 Data Received:", req.body);

  try {
    if (!role) return res.status(400).json({ error: "Role is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      collegeId: role === "student" ? collegeId : undefined,
    });

    await newUser.save();
    console.log("✅ User saved:", newUser);

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login Route with JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Send token + user
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
