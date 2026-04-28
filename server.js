const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());
app.options('*', cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const partRoutes = require('./routes/partRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/parts', partRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Parts Delivery API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
