const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  queueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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

// Generate ticket number
ticketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const queue = await mongoose.model('Queue').findById(this.queueId);
    const date = new Date();
    const prefix = queue.name.substring(0, 3).toUpperCase();
    const count = await this.constructor.countDocuments({
      queueId: this.queueId,
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate())
      }
    });
    
    this.ticketNumber = `${prefix}-${(count + 1).toString().padStart(3, '0')}`;
    
    // Calculate position
    const lastTicket = await this.constructor.findOne(
      { queueId: this.queueId, status: 'WAITING' },
      { position: 1 },
      { sort: { position: -1 } }
    );
    
    this.position = lastTicket ? lastTicket.position + 1 : 1;
    
    // Calculate estimated wait time
    if (queue.averageServiceTime) {
      this.estimatedWaitTime = this.position * queue.averageServiceTime;
    }
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);