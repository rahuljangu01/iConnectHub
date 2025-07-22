import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Clock, CreditCard, Image, FileText, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './CreateEventPage.css';

const CreateEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    time: '',
    fee: '',
    posterUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'fee' ? value.replace(/[^0-9]/g, '') : value;

    setFormData({
      ...formData,
      [name]: updatedValue
    });

    setError('');
  };

  const showError = (msg) => {
    setError(msg);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { title, description, venue, date, time, fee, posterUrl } = formData;

    if (!title.trim()) return showError('Event title is required');
    if (!description.trim()) return showError('Event description is required');
    if (!venue.trim()) return showError('Venue is required');
    if (!date) return showError('Event date is required');
    if (!time) return showError('Event time is required');

    const eventDateTime = new Date(`${date}T${time}`);
    if (eventDateTime <= new Date()) return showError('Event date and time must be in the future');

    const token = localStorage.getItem('token');
    if (!token || !user || !user.id) return showError('User not authenticated');

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      venue: venue.trim(),
      date,
      time,
      fee: parseInt(fee) || 0, // ✅ stored correctly as fee
      posterUrl: posterUrl.trim() || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
      organizer: user.id
    };

    try {
      const result = await api.createEvent(eventData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/events'), 2000);
      } else {
        showError(result.message || 'Failed to create event');
      }
    } catch (err) {
      console.error(err);
      showError('Server error while creating event');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="create-event-page">
        <div className="container">
          <motion.div
            className="success-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="success-icon">
              <Calendar size={48} />
            </div>
            <h2>Event Created Successfully!</h2>
            <p>Your event has been created and is now visible to students.</p>
            <p>Redirecting to Events page...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-event-page">
      <div className="container">
        <motion.button
          className="back-button"
          onClick={() => navigate('/club-dashboard')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </motion.button>

        <motion.div
          className="create-event-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="create-event-header">
            <div className="header-icon">
              <Calendar size={32} />
            </div>
            <h1>Create New Event</h1>
            <p>Fill in the details to create an exciting event for students</p>
          </div>

          <form onSubmit={handleSubmit} className="create-event-form">
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <div className="form-grid">
              {/* Title */}
              <div className="form-group full-width">
                <label htmlFor="title" className="form-label">
                  <FileText size={18} /> Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter event title"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group full-width">
                <label htmlFor="description" className="form-label">
                  <FileText size={18} /> Event Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe your event"
                  rows="4"
                  required
                />
              </div>

              {/* Venue */}
              <div className="form-group">
                <label htmlFor="venue" className="form-label">
                  <MapPin size={18} /> Venue
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Event venue"
                  required
                />
              </div>

              {/* Fee */}
              <div className="form-group">
                <label htmlFor="fee" className="form-label">
                  <CreditCard size={18} /> Ticket Fee (₹)
                </label>
                <input
                  type="number"
                  id="fee"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0 for free"
                  min="0"
                />
              </div>

              {/* Date */}
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  <Calendar size={18} /> Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Time */}
              <div className="form-group">
                <label htmlFor="time" className="form-label">
                  <Clock size={18} /> Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Poster URL */}
              <div className="form-group full-width">
                <label htmlFor="posterUrl" className="form-label">
                  <Image size={18} /> Poster URL (optional)
                </label>
                <input
                  type="url"
                  id="posterUrl"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/poster.jpg"
                />
                <span className="form-hint">Leave empty to use a default poster</span>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/club-dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Calendar size={18} />
                    Create Event
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEventPage;
