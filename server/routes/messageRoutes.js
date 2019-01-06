// messageRoutes.js
// Initialize express router
let router = require('express').Router();

// Import message controller
var messageController = require('../controllers/messageController');

// Moessage routes
router.route('/')
    .get(messageController.index);

router.route('/bot/:botID')
    .post(messageController.spreadBotMessage);

router.route('/:istID')
    .post(messageController.spreadUserMessage);


// Export API routes
module.exports = router;
