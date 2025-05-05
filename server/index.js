const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const studentRoutes = require("./routes/student.routes");

const app = express();
const port = 3000;
const MONGODB_URI = "mongodb://localhost:27017/sis_database";

// Middleware setup
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  if (['POST', 'PUT'].includes(req.method)) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Student Information System API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: err.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

