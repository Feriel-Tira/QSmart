const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  queueId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: String,
  userPhone: String,
  status: {
    type: String,
    enum: ['WAITING', 'CALLED', 'SERVED', 'CANCELLED', 'EXPIRED'],
    default: 'WAITING'
  },
  priority: {
    type: String,
    enum: ['NORMAL', 'PRIORITY', 'VIP', 'URGENCY'],
    default: 'NORMAL'
  },
  position: {
    type: Number,
    required: true
  },
  estimatedWaitTime: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  calledAt: Date,
  servedAt: Date,
  cancelledAt: Date
});

// Generate ticket number before saving
ticketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Count tickets for today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const count = await this.constructor.countDocuments({
      queueId: this.queueId,
      createdAt: { $gte: startOfDay }
    });
    
    this.ticketNumber = `${this.queueId.slice(-3)}-${year}${month}${day}-${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);