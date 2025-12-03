const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const queueRoutes = require('./routes/queueRoutes');

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/queues', queueRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'queue-service',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Queue Service: Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Queue Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Queue Service: MongoDB connection error:', err);
    process.exit(1);
  });