// Routes Configuration
let buildingRoutes = require("./buildingRoutes")
let userRoutes = require("./userRoutes")
let movementRoutes = require("./movementRoutes")
let messageRoutes = require("./messageRoutes")

//Tutorial
const { body, validationResult } = require('express-validator/check');

module.exports = function(app){
    app.use('/buildings', buildingRoutes)
    app.use('/users', userRoutes)
    app.use('/movements', movementRoutes)
    app.use('/messages', messageRoutes)
    app.get('/', function(req, res){
        res.render('./form', { title: 'Registration form' });
    });
    app.post('/',
        [
            body('name')
              .isLength({ min: 1 })
              .withMessage('Please enter a name'),
            body('email')
              .isLength({ min: 1 })
              .withMessage('Please enter an email'),
        ],
        (req, res) => {
            const errors = validationResult(req);

            if (errors.isEmpty()) {
                res.send('Thank you for your registration!');
            } else {
                res.render('form', {
                    title: 'Registration form',
                    errors: errors.array(),
                    data: req.body,
                });
            }
        });
};
