const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// For Vercel, we might need to handle the connection differently or just let it connect
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

const partRoutes = require('../routes/partRoutes');
const authRoutes = require('../routes/authRoutes');

app.use('/api/parts', partRoutes);
app.use('/api/auth', authRoutes);

app.get('/api', (req, res) => {
  res.send('Parts Delivery API is running...');
});

module.exports = app;
