// movementRoutes.js
// Initialize express router
let router = require('express').Router();

// Import movement controller
var movementController = require('../controllers/movementController');

// Movement routes
router.route('/')
    .get(movementController.index)
    .post(movementController.new);


// Export API routes
module.exports = router;
