const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tickets', ticketRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'ticket-service',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB (using same MongoDB as queue service)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Ticket Service: Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Ticket Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Ticket Service: MongoDB connection error:', err);
    process.exit(1);
  });