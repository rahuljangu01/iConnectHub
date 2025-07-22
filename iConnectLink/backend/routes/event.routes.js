// backend/routes/event.routes.js

const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const verifyToken = require("../middleware/auth.middleware");

// ✅ YEH NAYI ROUTE ADD KARO
// Yeh route '/api/events/my-events' ban jayegi
router.get("/my-events", verifyToken, eventController.getEventsByOrganizer);

// Create event (requires login)
router.post("/", verifyToken, eventController.createEvent);

// Get all events (public)
router.get("/", eventController.getAllEvents);

// Get single event by ID
router.get("/:id", eventController.getEventById);

// Update event (only by creator)
router.put("/:id", verifyToken, eventController.updateEvent);

// Delete event (only by creator)
router.delete("/:id", verifyToken, eventController.deleteEvent);

module.exports = router;