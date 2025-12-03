const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Public routes
router.get('/:id', ticketController.getTicket);
router.get('/user/:userId', ticketController.getUserTickets);
router.get('/queue/:queueId', ticketController.getQueueTickets);
router.get('/queue/:queueId/current', ticketController.getCurrentTicket);

// Protected routes
router.post('/', ticketController.createTicket);
router.post('/queue/:queueId/call-next', ticketController.callNextTicket);
router.put('/:ticketId/serve', ticketController.serveTicket);
router.put('/:ticketId/cancel', ticketController.cancelTicket);

module.exports = router;