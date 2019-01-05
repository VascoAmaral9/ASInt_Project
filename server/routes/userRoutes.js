// userRoutes.js
// Initialize express router
let router = require('express').Router();

// Import user controller
var userController = require('../controllers/userController');
// Import services
var fenixServices = require('../services/fenix');
var locationServices = require('../services/location');


// User routes
router.route('/')
    .get(userController.index)
    .post(userController.new);

router.route('/auth')
    .get(fenixServices.login);

router.route('/location')
    .get(locationServices.globalUpdate);

router.route('/:istID')
    .get(userController.view)
    .put(userController.update)
    .delete(userController.delete);

router.route('/:istID/location')
    .post(locationServices.userUpdate)


// Export API routes
module.exports = router;
