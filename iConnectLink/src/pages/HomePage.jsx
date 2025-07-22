import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer'; // Keep this import
import { api } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.getEvents();
        if (response.success && Array.isArray(response.events)) {
          // Use a safer key like _id for mapping
          const upcoming = response.events.slice(0, 3);
          setUpcomingEvents(upcoming);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const features = [
    {
      icon: <Calendar className="feature-icon" />,
      title: "Easy Event Discovery",
      description: "Browse and discover exciting events happening on campus with our intuitive interface."
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Club Management",
      description: "Clubs can easily create, manage, and promote their events to reach more students."
    },
    {
      icon: <CheckCircle className="feature-icon" />,
      title: "Simple Booking",
      description: "Book event tickets with just a few clicks and manage your bookings effortlessly."
    }
  ];

  const stats = [
    { number: "500+", label: "Active Students", icon: <Users /> },
    { number: "50+", label: "Campus Clubs", icon: <Star /> },
    { number: "200+", label: "Events Hosted", icon: <Calendar /> },
    { number: "1000+", label: "Tickets Booked", icon: <CheckCircle /> }
  ];

  // ✅ CORRECTION STARTS HERE
  return (
    <> {/* Step 1: Wrap everything in a React Fragment */}
      <div className="homepage">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <motion.div 
              className="hero-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="hero-title">
                Discover Amazing 
                <span className="hero-highlight"> College Events</span>
              </h1>
              <p className="hero-description">
                Your ultimate platform for campus events. Find, book, and manage 
                tickets for the most exciting events happening at your college.
              </p>
              <div className="hero-buttons">
                <Link to="/events" className="btn btn-primary btn-large">
                  Browse Events <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="hero-image"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg" 
                alt="College Events"
              />
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <motion.div 
              className="stats-grid"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="upcoming-events-section">
          <div className="container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-description">
                Don't miss out on these exciting upcoming events happening on campus
              </p>
            </motion.div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner" />
                <p>Loading events...</p>
              </div>
            ) : (
              <div className="events-grid">
                {/* Use a proper unique key like event._id */}
                {upcomingEvents.map((event, index) => (
                  <EventCard key={event._id || index} event={event} index={index} />
                ))}
              </div>
            )}

            <motion.div 
              className="section-footer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/events" className="btn btn-primary">
                View All Events <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Why Choose Event Hub?</h2>
              <p className="section-description">
                Everything you need to discover, manage, and enjoy college events
              </p>
            </motion.div>

            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  {feature.icon}
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <motion.div 
              className="cta-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="cta-title">Ready to Get Started?</h2>
              <p className="cta-description">
                Join thousands of students and clubs already using College Event Hub
              </p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary btn-large">
                  Sign Up Now
                </Link>
                <Link to="/events" className="btn btn-secondary btn-large">
                  Browse Events
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer /> {/* Step 2: Add Footer outside the main div but inside the fragment */}
    </>
  );
}; // <-- Step 3: Remove the extra closing brace from here and put it after the function body.

export default HomePage;