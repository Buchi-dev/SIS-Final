const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  userId: {type: String, required: true, unique: true},
  firstName: {type: String, required: true},
  middleName: {type: String},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true, lowercase: true},
  password: {type: String, required: true},
}, { timestamps: true });

module.exports = mongoose.model('users-data', userSchema);
