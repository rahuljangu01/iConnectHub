// src/pages/ClubDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api'; // ✅ Import your api service
import Spinner from '../components/Spinner';
import './ClubDashboard.css';

const ClubDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchMyEvents = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // ✅ Use the new function from api.js
      const response = await api.getMyEvents();

      if (response.success) {
        setEvents(response.events);
      } else {
        console.error("Failed to fetch events:", response.message);
        setEvents([]);
      }

    } catch (error) {
      console.error('❌ Error fetching club events:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setDeleting(eventId);
      
      // ✅ Use the delete function from api.js
      const response = await api.deleteEvent(eventId);

      if(response.success) {
        // Refetch events to get the updated list
        fetchMyEvents();
      } else {
        alert(response.message || 'Failed to delete event.');
      }
      
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // ... (the rest of your component's JSX remains exactly the same) ...

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.date) < new Date());
  const totalBookings = events.reduce((sum, event) => sum + (event.bookings || 0), 0);

  return (
    <div className="club-dashboard">
      {/*... Your entire JSX from before goes here ... */}
      <div className="container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="welcome-section">
            <div className="club-avatar">
              <Users size={32} />
            </div>
            <div className="welcome-text">
              <h1>Welcome, {user?.name}!</h1>
              <p>Manage your events and track student engagement</p>
            </div>
          </div>

          <Link to="/create-event" className="btn btn-primary create-event-btn">
            <Plus size={20} />
            Create New Event
          </Link>
        </motion.div>

        <motion.div
          className="dashboard-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="stat-card">
            <div className="stat-icon total">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{events.length}</span>
              <span className="stat-label">Total Events</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon upcoming">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{upcomingEvents.length}</span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon past">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{pastEvents.length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bookings">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{totalBookings}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="events-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2>My Events</h2>
            {events.length > 0 && (
              <Link to="/create-event" className="btn btn-outline">
                <Plus size={18} />
                Add Event
              </Link>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <Spinner size="large" />
              <p>Loading your events...</p>
            </div>
          ) : (
            <div className="events-content">
              {events.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={64} />
                  <h3>No Events Created</h3>
                  <p>Start creating events to engage with students and build your community!</p>
                  <Link to="/create-event" className="btn btn-primary">
                    <Plus size={20} />
                    Create Your First Event
                  </Link>
                </div>
              ) : (
                <div className="events-grid">
                  {events.map((event, index) => (
                    <motion.div
                      key={event._id}
                      className="event-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="event-image">
                        <img src={event.posterUrl} alt={event.title} />
                        <div className="event-status">
                          {new Date(event.date) >= new Date() ? (
                            <span className="status-upcoming">Upcoming</span>
                          ) : (
                            <span className="status-completed">Completed</span>
                          )}
                        </div>
                      </div>

                      <div className="event-content">
                        <h3 className="event-title">{event.title}</h3>
                        <p className="event-description">
                          {event.description.length > 100
                            ? `${event.description.substring(0, 100)}...`
                            : event.description}
                        </p>

                        <div className="event-meta">
                          <div className="meta-item">
                            <Calendar size={16} />
                            <span>{formatDate(event.date)} at {event.time}</span>
                          </div>
                          <div className="meta-item">
                            <Users size={16} />
                            <span>{event.bookings || 0} bookings</span>
                          </div>
                        </div>

                        <div className="event-actions">
                          <Link
                            to={`/events/${event._id}`}
                            className="action-btn view"
                            title="View Event"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            className="action-btn edit"
                            title="Edit Event"
                            onClick={() => console.log('Edit event:', event._id)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="action-btn delete"
                            title="Delete Event"
                            onClick={() => handleDeleteEvent(event._id)}
                            disabled={deleting === event._id}
                          >
                            {deleting === event._id ? (
                              <div className="mini-spinner" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ClubDashboard;