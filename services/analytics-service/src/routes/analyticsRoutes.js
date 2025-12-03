const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/queue/:queueId/stats', analyticsController.getQueueStats);
router.get('/queue/:queueId/daily', analyticsController.getDailyStats);
router.get('/queue/:queueId/peak-hours', analyticsController.getPeakHours);

module.exports = router;