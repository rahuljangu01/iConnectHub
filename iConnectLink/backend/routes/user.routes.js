const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/user.controller');
const verifyToken = require('../middleware/auth.middleware');

// @route   POST /api/users/change-password
// @desc    Change user's password
// @access  Private (requires token)
router.post('/change-password', verifyToken, changePassword);

module.exports = router;