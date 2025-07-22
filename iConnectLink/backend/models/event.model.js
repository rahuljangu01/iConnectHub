// backend/models/event.model.js  -- CORRECTED VERSION

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  date: {
    type: String, // Using String as per your other files
    required: [true, "Date is required"],
  },
  time: {
    type: String, // Added time field to match your controller
    required: [true, "Time is required"],
  },
  venue: {
    type: String,
    required: [true, "Venue is required"],
  },
  fee: {
    type: Number,
    default: 0
  },
  posterUrl: {
    type: String,
    default: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg"
  },
  // ✅ THE FIX: Renamed 'club' to 'organizer' and referencing 'User'
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This should reference your User model
    required: true,
  },
}, { timestamps: true }); // Good practice to add timestamps

module.exports = mongoose.model("Event", eventSchema);