// Routes Configuration
let buildingRoutes = require("./buildingRoutes")

module.exports = function(app){
    app.use('/buildings', buildingRoutes)
};
