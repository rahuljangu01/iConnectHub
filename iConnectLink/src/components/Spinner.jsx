import React from 'react';
import { motion } from 'framer-motion';
import './Spinner.css';

const Spinner = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className="spinner-container">
      <motion.div
        className={`spinner spinner-${size} spinner-${color}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Spinner;