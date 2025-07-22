import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event, index = 0 }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <motion.div
      className="event-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* Event Poster */}
      <div className="event-card-image">
        <img
          src={event.posterUrl || '/default-poster.jpg'}
          alt={event.title}
          onError={(e) => { e.target.src = '/default-poster.jpg'; }}
        />
        <div className="event-card-overlay">
          {event.fee === 0 ? (
            <span className="event-badge free">FREE</span>
          ) : (
            <span className="event-badge paid">₹{event.fee}</span>
          )}
        </div>
      </div>

      {/* Event Content */}
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-description">
          {event.description.length > 100 
            ? `${event.description.substring(0, 100)}...` 
            : event.description}
        </p>

        {/* Event Metadata */}
        <div className="event-card-details">
          <div className="event-detail">
            <Calendar size={16} />
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>
          <div className="event-detail">
            <MapPin size={16} />
            <span>{event.venue}</span>
          </div>
          {event.fee > 0 && (
            <div className="event-detail">
              <CreditCard size={16} />
              <span>₹{event.fee}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link to={`/events/${event._id}`} className="btn btn-primary event-card-button">
          {event.fee > 0 ? 'Book Now' : 'Register Free'}
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
