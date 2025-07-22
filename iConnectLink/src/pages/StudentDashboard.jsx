// src/pages/StudentDashboard.jsx -- CORRECTED & SAFER VERSION

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // ✅ Use Link for internal navigation
import {
  Calendar,
  MapPin,
  CreditCard,
  User,
  BookOpen,
  History,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Spinner from '../components/Spinner';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]); // Already initialized correctly, which is great!
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchBookings = async () => {
      // Don't do anything if the user isn't loaded yet
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.getUserBookings(user.id);

        // ✅ FIX #1: Add a safety check to ensure response.bookings is an array
        if (response.success && Array.isArray(response.registrations)) {
          setBookings(response.registrations); // The backend sends 'registrations'
        } else {
          console.error("API did not return a valid bookings array:", response);
          setBookings([]); // Fallback to an empty array on bad response
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings([]); // Fallback to an empty array on network error
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const now = new Date();
  
  // ✅ FIX #2: Add a check to ensure `bookings` is an array before filtering
  const upcoming = Array.isArray(bookings) ? bookings.filter((b) => b.event && new Date(b.event.date) >= now) : [];
  const past = Array.isArray(bookings) ? bookings.filter((b) => b.event && new Date(b.event.date) < now) : [];
  
  const currentList = activeTab === 'upcoming' ? upcoming : past;

  const formatDate = (dateStr) => {
    if (!dateStr) return ''; // Safety check for date
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="student-dashboard">
      <div className="container">

        {/* Header */}
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="welcome-section">
            <div className="user-avatar"><User size={32} /></div>
            <div className="welcome-text">
              <h1>Welcome back, {user?.name}!</h1>
              <p>Manage your event bookings and discover new events</p>
            </div>
          </div>

          <div className="user-info">
            <div className="info-item">
              <span className="info-label">College ID: </span>
              <span className="info-value">{user?.collegeId || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email: </span>
              <span className="info-value">{user?.email}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="dashboard-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="stat-card">
            <div className="stat-icon upcoming"><Calendar size={24} /></div>
            <div className="stat-content">
              <span className="stat-number">{upcoming.length}</span>
              <span className="stat-label">Upcoming Events</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon past"><History size={24} /></div>
            <div className="stat-content">
              <span className="stat-number">{past.length}</span>
              <span className="stat-label">Past Events</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total"><BookOpen size={24} /></div>
            <div className="stat-content">
              <span className="stat-number">{bookings.length}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>
        </motion.div>

        {/* Bookings */}
        <motion.div
          className="bookings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2>My Bookings</h2>
            <div className="tab-selector">
              <button
                className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming ({upcoming.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                Past ({past.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <Spinner size="large" />
              <p>Loading your bookings...</p>
            </div>
          ) : currentList.length > 0 ? (
            <div className="bookings-grid">
              {currentList.map((booking, index) => {
                const event = booking?.event;
                // Skip rendering if the event data within the booking is missing
                if (!event) return null;

                return (
                  <motion.div
                    // Use a unique ID from the booking itself
                    key={booking._id || booking.id} 
                    className={`booking-card ${activeTab}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="booking-image">
                      <img src={event.posterUrl} alt={event.title} />
                      <div className={`booking-status ${activeTab}`}>
                        {activeTab === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </div>
                    </div>
                    <div className="booking-content">
                      <h3 className="booking-title">{event.title}</h3>
                      <div className="booking-details">
                        <div className="booking-detail">
                          <Calendar size={16} />
                          <span>{formatDate(event.date)} at {event.time}</span>
                        </div>
                        <div className="booking-detail">
                          <MapPin size={16} />
                          <span>{event.venue}</span>
                        </div>
                        {event.fee > 0 && (
                          <div className="booking-detail">
                            <CreditCard size={16} />
                            <span>₹{event.fee}</span>
                          </div>
                        )}
                      </div>
                      <div className="booking-footer">
                        <span className="booking-date">
                          Booked on {formatDate(booking.registeredAt || booking.bookingDate)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              {activeTab === 'upcoming' ? <Calendar size={64} /> : <History size={64} />}
              <h3>No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events</h3>
              <p>
                {activeTab === 'upcoming'
                  ? "You haven't booked any upcoming events yet."
                  : "You haven't attended any events yet."}
              </p>
              {/* ✅ Use Link component for better navigation */}
              <Link to="/events" className="btn btn-primary">Browse Events</Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;