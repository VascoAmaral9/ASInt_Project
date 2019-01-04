// userRoutes.js
// Initialize express router
let router = require('express').Router();

// Import user controller
var userController = require('../controllers/userController');
// Import fenix services
var fenixServices = require('../services/fenix')


// User routes
router.route('/')
    .get(userController.index)
    .post(userController.new);

router.route('/auth')
    .get(fenixServices.login);

router.route('/:istID')
    .get(userController.view)
    .put(userController.update)
    .delete(userController.delete);



// Export API routes
module.exports = router;