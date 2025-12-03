const Analytics = require('../models/Analytics');
const mongoose = require('mongoose');

exports.getQueueStats = async (req, res) => {
  try {
    const { queueId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's analytics or create if doesn't exist
    let analytics = await Analytics.findOne({
      queueId,
      date: today
    });
    
    if (!analytics) {
      analytics = new Analytics({
        queueId,
        date: today,
        totalTickets: 0,
        servedTickets: 0,
        cancelledTickets: 0,
        averageWaitTime: 0
      });
      await analytics.save();
    }
    
    res.json({
      queueId,
      date: today.toISOString().split('T')[0],
      totalTickets: analytics.totalTickets,
      servedTickets: analytics.servedTickets,
      cancelledTickets: analytics.cancelledTickets,
      averageWaitTime: analytics.averageWaitTime,
      peakHour: analytics.peakHour
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDailyStats = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { startDate, endDate } = req.query;
    
    const query = { queueId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const stats = await Analytics.find(query)
      .sort('date')
      .limit(30); // Last 30 days
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPeakHours = async (req, res) => {
  try {
    const { queueId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const analytics = await Analytics.findOne({
      queueId,
      date: today
    });
    
    if (!analytics || !analytics.hourlyStats.length) {
      return res.json({
        queueId,
        date: today.toISOString().split('T')[0],
        peakHour: '10:00',
        hourlyStats: []
      });
    }
    
    res.json({
      queueId,
      date: today.toISOString().split('T')[0],
      peakHour: analytics.peakHour,
      hourlyStats: analytics.hourlyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recordTicketServed = async (queueId, waitTime) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const hour = today.getHours().toString().padStart(2, '0') + ':00';
    
    await Analytics.findOneAndUpdate(
      { queueId, date: today },
      {
        $inc: {
          totalTickets: 1,
          servedTickets: 1
        },
        $push: {
          hourlyStats: {
            hour,
            ticketsServed: 1,
            averageWaitTime: waitTime
          }
        }
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error recording ticket served:', error);
  }
};