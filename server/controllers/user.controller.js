const User = require('../model/user_model');
const bcrypt = require('bcrypt');

// Helper functions for common operations
const handleServerError = (res, error, message = 'Server error') => {
  console.error(`Error: ${message}:`, error);
  res.status(500).json({ 
    message,
    error: error.message,
    stack: undefined
  });
};

const sanitizeUser = (user) => ({
  userId: user.userId,
  firstName: user.firstName,
  middleName: user.middleName,
  lastName: user.lastName,
  email: user.email
});

// Register a new user
exports.register = async (req, res) => {
  try {
    const { userId, firstName, middleName, lastName, email, password } = req.body;
    
    // Validate required fields
    if (!userId || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['userId', 'firstName', 'lastName', 'email', 'password'],
        received: Object.keys(req.body)
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already in use' : 'User ID already exists' 
      });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      userId,
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: sanitizeUser(user)
    });
  } catch (error) {
    handleServerError(res, error, 'Error registering user');
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.status(200).json({ 
      message: 'Login successful',
      user: sanitizeUser(user)
    });
  } catch (error) {
    handleServerError(res, error, 'Error logging in');
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      ...sanitizeUser(user),
      createdAt: user.createdAt
    });
  } catch (error) {
    handleServerError(res, error, 'Error fetching user profile');
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = { ...req.body };
    
    // Prevent changing userId
    delete updateData.userId;
    
    const user = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User updated successfully',
      user: sanitizeUser(user)
    });
  } catch (error) {
    handleServerError(res, error, 'Error updating user');
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const result = await User.findOneAndDelete({ userId });
    
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    handleServerError(res, error, 'Error deleting user');
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    handleServerError(res, error, 'Error fetching users');
  }
}; 