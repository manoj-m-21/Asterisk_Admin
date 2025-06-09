const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');
const extensionRoutes = require('./routes/extension');
const mediaRoutes = require('./routes/mediaRoutes');
const recordingRoutes = require('./routes/recordings');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000', // Specify the frontend URL
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // If you're using credentials (cookies, sessions)
};

// Connect to MongoDB
connectDB();

// Use CORS with options
app.use('*', cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve Asterisk recordings statically with CORP headers
app.use('/api/recordings/play', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Health Check Route
app.get('/api/health', (req, res) => res.send('Server is up and running'));

// API Routes
app.use('/api/extensions', extensionRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/recordings', recordingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
