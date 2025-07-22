import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}) => {
  const buttonClass = `
    button
    button-${variant}
    button-${size}
    ${disabled ? 'button-disabled' : ''}
    ${loading ? 'button-loading' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <div className="button-spinner" />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;