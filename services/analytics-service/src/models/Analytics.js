const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  queueId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  totalTickets: {
    type: Number,
    default: 0
  },
  servedTickets: {
    type: Number,
    default: 0
  },
  cancelledTickets: {
    type: Number,
    default: 0
  },
  averageWaitTime: {
    type: Number,
    default: 0
  },
  peakHour: {
    type: String,
    default: '10:00'
  },
  hourlyStats: [{
    hour: String,
    ticketsServed: Number,
    averageWaitTime: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

analyticsSchema.index({ queueId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);