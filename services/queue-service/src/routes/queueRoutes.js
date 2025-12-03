const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Public routes
router.get('/', queueController.getAllQueues);
router.get('/:id', queueController.getQueueById);

// Protected routes (would add auth middleware in production)
router.post('/', queueController.createQueue);
router.put('/:id', queueController.updateQueue);
router.delete('/:id', queueController.deleteQueue);

module.exports = router;