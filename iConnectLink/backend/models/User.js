const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  role: {
    type: String,
    enum: ["student", "club"],
    required: [true, "Role is required"]
  },
  collegeId: {
    type: String,
    required: function () {
      return this.role === "student";
    },
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
