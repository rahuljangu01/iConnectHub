import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar } from 'lucide-react';
import EventCard from '../components/EventCard';
import Spinner from '../components/Spinner';
import { api } from '../services/api';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feeFilter, setFeeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.getEvents();
      console.log("Fetched Events:", response);

      if (response.success && Array.isArray(response.events)) {
        setEvents(response.events);
      } else {
        console.warn("No events returned from backend.");
        setEvents([]); // fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic wrapped in useCallback
  const filterEvents = useCallback(() => {
    let filtered = [...events];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        event.venue?.toLowerCase().includes(term)
      );
    }

    if (feeFilter === 'free') {
      filtered = filtered.filter(event => event.fee === 0);
    } else if (feeFilter === 'paid') {
      filtered = filtered.filter(event => event.fee > 0);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'fee':
          return a.fee - b.fee;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, feeFilter, sortBy]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  return (
    <div className="events-page">
      <div className="container">
        <motion.div
          className="events-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="events-title">All Events</h1>
          <p className="events-description">
            Discover and book tickets for amazing events happening on campus.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="events-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-container">
            <Filter className="filter-icon" />
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Events</option>
              <option value="free">Free Events</option>
              <option value="paid">Paid Events</option>
            </select>
          </div>

          <div className="sort-container">
            <Calendar className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="fee">Sort by Fee</option>
            </select>
          </div>
        </motion.div>

        {/* Event List */}
        {loading ? (
          <div className="events-loading">
            <Spinner size="large" />
            <p>Loading events...</p>
          </div>
        ) : (
          <>
            <motion.div
              className="events-count"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p>
                Showing {filteredEvents.length} of {events.length} events
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </motion.div>

            {filteredEvents.length === 0 ? (
              <motion.div
                className="no-events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="no-events-icon">
                  <Calendar size={64} />
                </div>
                <h3>No events found</h3>
                <p>
                  {searchTerm
                    ? `No events match your search for "${searchTerm}"`
                    : 'No events available with the current filters'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn btn-primary"
                  >
                    Clear Search
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="events-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {filteredEvents.map((event, index) => (
                  <EventCard key={event._id || event.id} event={event} index={index} />
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
