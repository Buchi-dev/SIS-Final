const mongoose = require('mongoose');

/**
 * Student schema for storing student information
 */
const studentSchema = new mongoose.Schema({
  // Unique student identifier
  studentId: {
    type: String,
    required: true,
    unique: true
  },

  // Personal information
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: true
  },
  
  // Academic information
  program: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  
  // Additional information
  dateOfBirth: {
    type: Date
  },
  contactNumber: {
    type: String
  },
  address: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
