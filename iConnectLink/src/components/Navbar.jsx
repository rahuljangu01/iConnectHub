import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X, Calendar, User, LogOut, Home, CalendarDays, LayoutDashboard, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { user, logout, isAuthenticated, isStudent, isClub } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const controls = useAnimation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 10 && !isScrolled) {
      setIsScrolled(true);
      controls.start("scrolled");
    } else if (latest <= 10 && isScrolled) {
      setIsScrolled(false);
      controls.start("top");
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    scrolled: {
      backdropFilter: "blur(16px)",
      backgroundColor: "rgba(240, 244, 255, 0.85)",
      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.18)"
    },
    top: {
      backdropFilter: "blur(12px)",
      backgroundColor: "rgba(208, 226, 255, 0.7)",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
      borderBottom: "1px solid rgba(226, 232, 240, 0.5)"
    }
  };

  const logoVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10
      }
    },
    hover: {
      rotate: [0, 5, -5, 0],
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 150
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  const menuVariants = {
    hidden: { 
      y: -30,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    },
    exit: {
      y: -30,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const floatingSparkles = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: [0, 1, 0],
      y: [0, -15, 0],
      x: [0, (i % 2 === 0 ? 5 : -5), 0],
      transition: {
        duration: 1.5,
        delay: i * 0.2,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }
    })
  };

  return (
    <motion.nav
      className="navbar"
      initial="hidden"
      animate={["visible", controls]}
      variants={containerVariants}
    >
      <div className="navbar-container">
        {/* Logo with floating sparkles */}
        <motion.div 
          className="logo-wrapper"
          variants={logoVariants}
          whileHover="hover"
        >
          <Link to="/" className="navbar-logo">
            <motion.div className="logo-sparkle-container">
              <Calendar className="navbar-logo-icon" />
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="logo-sparkle"
                  custom={i}
                  variants={floatingSparkles}
                  initial="hidden"
                  animate="visible"
                >
                  <Sparkles size={12} />
                </motion.span>
              ))}
            </motion.div>
            <motion.span
              className="logo-text"
              whileHover={{ color: "#1d4ed8" }}
              transition={{ duration: 0.2 }}
            >
              iCampusLink
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop Menu Items */}
        <motion.div 
          className="navbar-menu desktop"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          {[
            { path: "/", icon: <Home size={18} />, text: "Home" },
            { path: "/events", icon: <CalendarDays size={18} />, text: "Events" },
            ...(isAuthenticated && isStudent ? 
              [{ path: "/student-dashboard", icon: <LayoutDashboard size={18} />, text: "Dashboard" }] : []),
            ...(isAuthenticated && isClub ? [
              { path: "/club-dashboard", icon: <LayoutDashboard size={18} />, text: "Dashboard" },
              { path: "/create-event", icon: <Plus size={18} />, text: "Create Event" }
            ] : [])
          ].map((item, index) => (
            <motion.div
              key={item.path}
              variants={itemVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredItem(index)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link 
                to={item.path} 
                className={`navbar-link ${location.pathname === item.path ? "active" : ""}`}
              >
                <motion.span className="nav-icon" style={{ marginRight: 8 }}>
                  {item.icon}
                </motion.span>
                {item.text}
                <AnimatePresence>
                  {hoveredItem === index && (
                    <motion.span
                      className="hover-underline"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}

          {isAuthenticated ? (
            <motion.div 
              className="navbar-user"
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(226, 232, 240, 0.7)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="user-avatar"
                whileHover={{ rotate: 5 }}
              >
                <User className="navbar-user-icon" />
              </motion.div>
              <span className="navbar-user-name">{user.name}</span>
              <motion.button 
                onClick={handleLogout} 
                className="navbar-logout"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(254, 242, 242, 0.7)" }}
                whileTap={{ scale: 0.9 }}
              >
                <LogOut size={18} />
              </motion.button>
            </motion.div>
          ) : (
            <>
              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link 
                  to="/signup" 
                  className="navbar-signup"
                >
                  <motion.span
                    className="signup-text"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign Up
                  </motion.span>
                  <motion.div 
                    className="signup-glow"
                    initial={{ opacity: 0 }}
                    whileHover={{ 
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                  />
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Mobile Toggle Button */}
        <motion.button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? (
            <X className="toggle-icon" />
          ) : (
            <Menu className="toggle-icon" />
          )}
        </motion.button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="navbar-menu mobile"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              {[
                { path: "/", icon: <Home size={20} />, text: "Home" },
                { path: "/events", icon: <CalendarDays size={20} />, text: "Events" },
                ...(isAuthenticated && isStudent ? 
                  [{ path: "/student-dashboard", icon: <LayoutDashboard size={20} />, text: "Dashboard" }] : []),
                ...(isAuthenticated && isClub ? [
                  { path: "/club-dashboard", icon: <LayoutDashboard size={20} />, text: "Dashboard" },
                  { path: "/create-event", icon: <Plus size={20} />, text: "Create Event" }
                ] : [])
              ].map((item) => (
                <motion.div 
                  key={item.path}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link 
                    to={item.path} 
                    className={`navbar-link ${location.pathname === item.path ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="nav-icon" style={{ marginRight: 12 }}>
                      {item.icon}
                    </span>
                    {item.text}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated ? (
                <motion.div 
                  className="navbar-user mobile"
                  variants={itemVariants}
                >
                  <User className="navbar-user-icon" />
                  <span className="navbar-user-name">{user.name}</span>
                  <button 
                    onClick={handleLogout} 
                    className="navbar-logout"
                  >
                    <LogOut size={18} />
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div variants={itemVariants}>
                    <Link 
                      to="/login" 
                      className="navbar-link mobile-login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link 
                      to="/signup" 
                      className="navbar-signup mobile-signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;