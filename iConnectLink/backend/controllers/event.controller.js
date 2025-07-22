// backend/controllers/event.controller.js

const Event = require('../models/event.model');
const mongoose = require('mongoose'); // ✅ Import mongoose for ObjectId

// ✅ Create a new event
exports.createEvent = async (req, res) => {
  try {
    console.log("📩 Event Request Body:", req.body);
    console.log("👤 User from Token:", req.user);

    // ✅ ADD THIS SECURITY CHECK
    if (req.user.role !== 'club') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only clubs are allowed to create events.',
      });
    }

    const {
      title,
      description,
      venue,
      date,
      time,
      fee,
      posterUrl,
    } = req.body;

    const newEvent = new Event({
      title,
      description,
      venue,
      date,
      time,
      fee: parseInt(fee) || 0,
      posterUrl: posterUrl || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
      organizer: req.user.id, // This will now match the corrected model
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('❌ Create Event Error:', error);
    // Better error handling for validation
    if (error.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({
      success: false,
      message: 'Event creation failed',
      error: error.message,
    });
  }
};

// ... (getAllEvents, getEventById, updateEvent, deleteEvent functions remain the same) ...

// ✅ Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      message: 'Events fetched successfully',
      events,
    });
  } catch (error) {
    console.error('❌ Get All Events Error:', error);
    res.status(500).json({
      success: false,
      message: 'Fetching events failed',
      error: error.message,
    });
  }
};

// ✅ Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Event ID',
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event fetched successfully',
      event,
    });
  } catch (error) {
    console.error('❌ Get Event By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Fetching event failed',
      error: error.message,
    });
  }
};

// ✅ Update event by ID
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the event creator can update this',
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, { new: true });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('❌ Update Event Error:', error);
    res.status(500).json({
      success: false,
      message: 'Updating event failed',
      error: error.message,
    });
  }
};

// ✅ Delete event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the event creator can delete this',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete Event Error:', error);
    res.status(500).json({
      success: false,
      message: 'Deleting event failed',
      error: error.message,
    });
  }
};


// ==========================================================
// ✅ THE FIX IS HERE - UPDATED getEventsByOrganizer
// ==========================================================
exports.getEventsByOrganizer = async (req, res) => {
  try {
    // It's safer to cast the user ID from the token to a MongoDB ObjectId
    const organizerId = new mongoose.Types.ObjectId(req.user.id);

    // Instead of Event.find(), we use Event.aggregate()
    const eventsWithBookingCounts = await Event.aggregate([
      // Step 1: Match only the events created by the logged-in club
      {
        $match: { organizer: organizerId }
      },
      // Step 2: Perform a "left join" to the 'registrations' collection
      {
        $lookup: {
          from: 'registrations',        // The actual name of the collection in MongoDB
          localField: '_id',            // Field from the Event collection
          foreignField: 'event',        // Field from the Registration collection
          as: 'registrationsInfo'       // Create a temporary array field with all matching bookings
        }
      },
      // Step 3: Add a new field called 'bookings' to each event document
      {
        $addFields: {
          // The value of 'bookings' will be the size (count) of the temporary array
          bookings: { $size: '$registrationsInfo' }
        }
      },
      // Step 4: Remove the large temporary array to keep the response clean
      {
        $project: {
          registrationsInfo: 0
        }
      },
      // Step 5: Sort the final results (e.g., newest events first)
      {
        $sort: { date: -1, time: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Club events with booking counts fetched successfully',
      // Send the newly processed data
      events: eventsWithBookingCounts,
    });

  } catch (error) {
    console.error('❌ Get Events By Organizer Error:', error);
    res.status(500).json({
      success: false,
      message: 'Fetching club events failed',
      error: error.message,
    });
  }
};