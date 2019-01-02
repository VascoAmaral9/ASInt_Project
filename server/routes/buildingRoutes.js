// buildingRoutes.js
// Initialize express router
let router = require('express').Router();

// Import building controller
var buildingController = require('../controllers/buildingController');

// Building routes
router.route('/')
    .get(buildingController.index)
    .post(buildingController.new);

router.route('/:building_id')
    .get(buildingController.view)
    .put(buildingController.update)
    .delete(buildingController.delete);

// Export API routes
module.exports = router;
