// userRoutes.js
// Initialize express router
let router = require('express').Router();

// Import user controller
var userController = require('../controllers/userController');
var messageController = require('../controllers/messageController');
// Import services
var fenixServices = require('../services/fenix');
var locationServices = require('../services/location');
var queriesServices = require('../services/queries');


// User routes
router.route('/')
    .get(userController.index)
    .post(userController.new);

router.route('/auth')
    .get(fenixServices.login);

router.route('/location')
    .get(locationServices.globalUpdate);

router.route('/active')
    .get(queriesServices.getActiveUsers);

router.route('/logs')
    .get(queriesServices.getLogs);

router.route('/:istID/location')
    .post(locationServices.userUpdate);

router.route('/:istID/message')
    .post(messageController.spreadUserMessage);

router.route('/:istID/nearbyUsers')
    .get(queriesServices.getNearbyUsers);

router.route('/:istID')
    .get(userController.view)
    .put(userController.update)
    .delete(userController.delete);


// Export API routes
module.exports = router;
