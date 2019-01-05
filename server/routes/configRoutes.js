// Routes Configuration
let buildingRoutes = require("./buildingRoutes")
let userRoutes = require("./userRoutes")
let movementRoutes = require("./movementRoutes")

module.exports = function(app){
    app.use('/buildings', buildingRoutes)
    app.use('/users', userRoutes)
    app.use('/movements', movementRoutes)
};
