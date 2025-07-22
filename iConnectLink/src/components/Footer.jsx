import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Calendar className="footer-logo-icon" />
              <span>College Event Hub</span>
            </div>
            <p className="footer-description">
              Your ultimate platform for discovering and managing college events. 
              Connect with clubs, book tickets, and never miss an exciting event on campus.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Browse Events</Link></li>
              <li><Link to="/login">Student Login</Link></li>
              <li><Link to="/signup">Join as Club</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">For Students</h3>
            <ul className="footer-links">
              <li><Link to="/student-dashboard">My Dashboard</Link></li>
              <li><Link to="/events">Book Tickets</Link></li>
              <li><Link to="/calendar">Event Calendar</Link></li>
              <li><Link to="/support">Help & Support</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact Info</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <MapPin size={16} />
                <span>LPU University, Phagwara, Punjab-144411</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>info@iconnnectlink.edu</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+91-9876543210</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 iConnectLink. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
