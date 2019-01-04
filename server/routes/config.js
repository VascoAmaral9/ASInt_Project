// Routes Configuration
let buildingRoutes = require("./buildingRoutes")
let userRoutes = require("./userRoutes")

module.exports = function(app){
    app.use('/buildings', buildingRoutes)
    app.use('/users', userRoutes)
};
