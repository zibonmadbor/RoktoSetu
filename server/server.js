const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static upload directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/recipients', require('./routes/recipientRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'RaktoSetu Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler for Multer or unknown errors
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'An error occurred during request processing',
    });
  }
  next();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[RaktoSetu Server] Running on port ${PORT}`);
});
