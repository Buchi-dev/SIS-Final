const mongoose = require('mongoose');

/**
 * User schema for authentication and user management
 */
const userSchema = new mongoose.Schema({
  // Unique user identifier
  userId: {
    type: String,
    required: true,
    unique: true
  },
  // User's personal information
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  // Authentication info
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
