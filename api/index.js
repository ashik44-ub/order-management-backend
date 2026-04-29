const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Improved CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
}));

app.use(express.json());

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // Set connection options for better stability in serverless
  const opts = {
    bufferCommands: false,
  };
  
  const db = await mongoose.connect(process.env.MONGODB_URI, opts);
  cachedDb = db;
  return db;
}

// Middleware to ensure database connection with detailed error
app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/health') {
    return next();
  }
  
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ 
      error: 'Database connection failed', 
      message: err.message,
      hint: 'Check if MONGODB_URI is correctly set in Vercel environment variables.'
    });
  }
});

// Paths updated because file is now in server/api/
const partRoutes = require('../routes/partRoutes');
const authRoutes = require('../routes/authRoutes');

// Explicitly handle both prefixed and non-prefixed routes
app.use('/api/parts', partRoutes);
app.use('/api/auth', authRoutes);
app.use('/parts', partRoutes);
app.use('/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Parts Delivery API is running...',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/', (req, res) => {
  res.send('Parts Delivery API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
