// Routes Configuration
let buildingRoutes = require("./buildingRoutes")
let userRoutes = require("./userRoutes")
let movementRoutes = require("./movementRoutes")
let messageRoutes = require("./messageRoutes")

module.exports = function(app){
    app.use('/buildings', buildingRoutes)
    app.use('/users', userRoutes)
    app.use('/movements', movementRoutes)
    app.use('/messages', messageRoutes)
};
