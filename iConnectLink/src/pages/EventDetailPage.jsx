import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, CreditCard, ArrowLeft, CheckCircle, AlertTriangle, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import FakePaymentPopup from '../components/FakePaymentPopup';
import './EventDetailPage.css';

const EventDetailPage = () => {
  const { id } = useParams(); // Get event ID from the URL
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  // State for the event data
  const [event, setEvent] = useState(null);
  
  // States to manage UI and flow
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');
  
  // States specifically for the demo payment flow
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isBooking, setIsBooking] = useState(false); // Disables button during API calls

  useEffect(() => {
    // Function to check if the user has already registered for this event
    const checkIfBooked = async () => {
      // Only run this check if a student is logged in
      if (isAuthenticated && isStudent && user?.id) {
        try {
          // Fetch all bookings for the logged-in user (token is handled by api.js)
          const res = await api.getUserBookings(); 
          
          if (res.success && Array.isArray(res.registrations)) {
            // Check if any booking in the user's list matches the current event's ID
            const isAlreadyBooked = res.registrations.some(reg => reg.event?._id === id);
            if (isAlreadyBooked) {
              setBooked(true); // Update state to show "Ticket Booked!" message
            }
          }
        } catch (err) {
          console.error("Could not check booking status", err);
        }
      }
    };

    // Function to fetch the event details from the server
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.getEvent(id);
        if (response.success) {
          setEvent(response.event);
        } else {
          setError(response.message || 'Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    // Run both functions when the component mounts
    fetchEvent();
    checkIfBooked();

  }, [id, isAuthenticated, isStudent, user]); // Re-run if any of these change

  // This function is triggered when the main "Book Ticket" button is clicked
  const handleBooking = async () => {
    if (!isAuthenticated || !isStudent) {
      navigate('/login');
      return;
    }
    setError('');
    setIsBooking(true);

    // If the event is FREE, book it directly
    if (event.fee === 0) {
      try {
        const response = await api.bookEvent(event._id, user.id);
        if (response.success) {
          setBooked(true);
        } else {
          setError(response.message || 'Booking failed.');
          if (response.message?.includes("already booked")) setBooked(true);
        }
      } catch(err) {
         setError("An error occurred during booking.");
      } finally {
        setIsBooking(false);
      }
      return;
    }
    
    // If the event is PAID, open our fake payment popup
    setShowPaymentPopup(true);
  };

  // This function is passed to the popup and runs after the fake payment is "successful"
  const handlePaymentSuccess = async () => {
    setShowPaymentPopup(false);
    // After fake payment, save the actual booking to the database
    try {
      const response = await api.bookEvent(event._id, user.id);
      if (response.success) {
        setBooked(true);
      } else {
        setError(response.message || "Something went wrong after payment. Please contact support.");
        if (response.message?.includes("already booked")) setBooked(true);
      }
    } catch (err) {
      setError("A network error occurred after payment.");
    } finally {
      setIsBooking(false);
    }
  };
  
  // This function is called if the user closes the payment popup
  const handlePaymentCancel = () => {
      setShowPaymentPopup(false);
      setIsBooking(false); // Re-enable the booking button
  };

  // Helper to format the date string
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // UI for the loading state
  if (loading) {
    return (
      <div className="event-detail-page">
        <div className="event-detail-loading">
          <Spinner size="large" />
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  // UI for when the event is not found or fails to load
  if (!event) {
    return (
      <div className="event-detail-page">
        <div className="container event-detail-error-container">
          <AlertTriangle size={64} />
          <h3>Event Not Found</h3>
          <p>{error || "The event you're looking for doesn't exist or has been removed."}</p>
          <Button variant="primary" onClick={() => navigate('/events')}>
            <ArrowLeft size={18} /> Back to Events
          </Button>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="event-detail-page">
      {/* AnimatePresence ensures the popup has a smooth exit animation */}
      <AnimatePresence>
        {showPaymentPopup && (
          <FakePaymentPopup
            event={event}
            user={user}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentCancel={handlePaymentCancel}
          />
        )}
      </AnimatePresence>
      
      <div className="container">
        <Link to="/events" className="back-link">
          <ArrowLeft size={18} />
          Back to All Events
        </Link>
        
        <div className="event-detail-content">
          {/* Left Side: Event Image */}
          <motion.div
            className="event-detail-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img src={event.posterUrl} alt={event.title} />
            <div className={`event-detail-badge ${event.fee === 0 ? 'badge-free' : 'badge-paid'}`}>
              {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
            </div>
          </motion.div>

          {/* Right Side: Event Information */}
          <motion.div
            className="event-detail-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="event-title">{event.title}</h1>

            <div className="event-meta">
              <div className="meta-item">
                <Calendar className="meta-icon" size={24} />
                <div>
                  <span className="meta-label">Date & Time</span>
                  <span className="meta-value">{formatDate(event.date)} at {event.time}</span>
                </div>
              </div>
              <div className="meta-item">
                <MapPin className="meta-icon" size={24} />
                <div>
                  <span className="meta-label">Venue</span>
                  <span className="meta-value">{event.venue}</span>
                </div>
              </div>
              {event.fee > 0 && (
                <div className="meta-item">
                  <CreditCard className="meta-icon" size={24} />
                  <div>
                    <span className="meta-label">Ticket Price</span>
                    <span className="meta-value">₹{event.fee}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="event-description">
              <h3>About This Event</h3>
              <p>{event.description}</p>
            </div>

            {/* Action Area: This is where the button or messages appear */}
            <div className="event-actions">
              {error && <div className="error-message">{error}</div>}
              
              {/* Main conditional rendering logic */}
              {booked ? (
                <div className="booked-message">
                  <CheckCircle size={24} />
                  <span>Ticket Booked! See you there.</span>
                </div>
              ) : isAuthenticated ? (
                isStudent ? (
                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleBooking}
                    loading={isBooking}
                    disabled={isBooking}
                    className="button-full"
                  >
                    {event.fee > 0 ? `Book for ₹${event.fee}` : 'Register for Free'}
                  </Button>
                ) : (
                  <div className="club-view">
                    <UserCheck size={18} /> You are viewing as a club organizer.
                  </div>
                )
              ) : (
                <div className="auth-required">
                  <p>Log in as a student to book your ticket!</p>
                  <Button variant="secondary" onClick={() => navigate('/login')}>
                    Login to Book
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;