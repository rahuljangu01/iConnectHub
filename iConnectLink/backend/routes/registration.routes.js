// backend/routes/registration.routes.js -- UPDATED & MORE SECURE

const express = require("express");
const router = express.Router();
const Registration = require("../models/registration.model");
const Event = require("../models/event.model"); // ✅ Import Event model for validation
const verifyToken = require("../middleware/auth.middleware");

// ✅ Book a ticket for an event.
// This route is now used for FREE events and for completing PAID events after the DEMO payment popup.
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { event: eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ success: false, message: "User and Event ID are required" });
    }

    // --- Optional but Recommended Security Check ---
    // In a real application with a real payment gateway, you would strictly enforce this check
    // to prevent users from booking paid events for free via a direct API call.
    // For our demo, the frontend flow is designed to call this endpoint even for paid events,
    // so we can't block it. But this is what the code would look like:
    /*
    const event = await Event.findById(eventId);
    if (event && event.fee > 0) {
       return res.status(403).json({ success: false, message: "This is a paid event and requires payment." });
    }
    */
    // --- End of Security Check ---

    const alreadyRegistered = await Registration.findOne({ user: userId, event: eventId });
    if (alreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: "You have already booked a ticket for this event.",
      });
    }

    const newRegistration = new Registration({ user: userId, event: eventId });
    await newRegistration.save();

    res.status(201).json({
      success: true,
      message: "Ticket booked successfully!",
      registration: newRegistration,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", details: error.message });
  }
});


// ✅ Get all ticket bookings (for Admin purposes)
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("user", "name email")
      .populate("event", "title date venue posterUrl fee"); // Added more fields

    res.status(200).json({
      success: true,
      registrations,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch registrations", details: error.message });
  }
});


// ✅ NEW: Get all bookings for the LOGGED-IN user (Secure)
// This replaces the old, insecure `/user/:id` route.
router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    // We get the user ID directly from the token, so a user can ONLY see their own bookings.
    const userId = req.user.id;

    const registrations = await Registration.find({ user: userId })
      .populate("event", "title date time venue posterUrl fee"); // Populate all useful event fields

    res.status(200).json({
      success: true,
      message: "User registrations fetched successfully",
      registrations, // The key is 'registrations'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch user registrations",
      details: error.message,
    });
  }
});


// ✅ Get all users for a specific event (Public or for Club Owner)
router.get("/event/:id", async (req, res) => {
  try {
    const eventId = req.params.id;

    const registrations = await Registration.find({ event: eventId })
      .populate("user", "name email collegeId"); // Added collegeId

    res.status(200).json({
      success: true,
      message: "Event registrations fetched successfully",
      registrations,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch event registrations", details: error.message });
  }
});


module.exports = router;