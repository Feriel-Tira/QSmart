const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 4004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'analytics-service',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Analytics Service: Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Analytics Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Analytics Service: MongoDB connection error:', err);
    process.exit(1);
  });