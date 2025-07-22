const User = require('../models/User');
const bcrypt = require('bcrypt');

// Change user password logic
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // From verifyToken middleware
    const { oldPassword, newPassword } = req.body;

    // Validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide old and new passwords." });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters long." });
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect old password." });
    }

    // Hash the new password for security
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully." });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};