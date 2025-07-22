import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import Spinner from './Spinner'; // Aapka Spinner component
import './FakePaymentPopup.css'; // Hum yeh CSS file abhi banayenge

const FakePaymentPopup = ({ event, user, onPaymentSuccess, onPaymentCancel }) => {
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'

  useEffect(() => {
    // Simulate payment processing time (e.g., 3 seconds)
    const timer = setTimeout(() => {
      // Simulate a successful payment
      setStatus('success');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // After success, wait 2 seconds then call the success function
    if (status === 'success') {
      const successTimer = setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
      return () => clearTimeout(successTimer);
    }
  }, [status, onPaymentSuccess]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const popupVariants = {
    hidden: { y: "100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { y: "100vh", opacity: 0 },
  };

  return (
    <motion.div
      className="popup-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="popup-content"
        variants={popupVariants}
      >
        <div className="popup-header">
          <h3>iCampusLink Secure Checkout</h3>
          <button onClick={onPaymentCancel} className="close-btn"><X size={20} /></button>
        </div>

        <div className="popup-body">
          <AnimatePresence mode="wait">
            {status === 'processing' && (
              <motion.div key="processing" className="status-container" exit={{ opacity: 0, scale: 0.8 }}>
                <Spinner size="large" />
                <h4>Processing Payment...</h4>
                <p>Please wait, do not close this window.</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                className="status-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.2, type: 'spring' } }}>
                  <ShieldCheck size={64} className="success-icon" />
                </motion.div>
                <h4>Payment Successful!</h4>
                <p>Your ticket for "{event.title}" is confirmed.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="popup-footer">
          <p>Amount: <strong>₹{event.fee}</strong></p>
          <p>Paying as: <strong>{user.name}</strong></p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FakePaymentPopup;