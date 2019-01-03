// buildingController.js
// Import building model
Building = require('../models/buildingModel');

// Handle index actions
exports.index = function (req, res) {
    Building.get(function (err, buildings) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else{
            res.json({
                status: "success",
                message: "Buildings retrieved successfully",
                data: buildings
            });
        }
    });
};

// Handle create building actions
exports.new = function (req, res) {
    var building = new Building();
    building.building_id = req.body.building_id;
    building.name = req.body.name;
    building.latitude = req.body.latitude;
    building.longitude = req.body.longitude;

    // save the building and check for errors
    building.save(function (err) {
        if (err)
            res.json(err);
        else{
            res.json({
                status: "success",
                message: 'New building created!',
                data: building
            });
        }
    });
};

// Handle view building info
exports.view = function (req, res) {
    Building.find({building_id: req.params.building_id}, function (err, building) {
        if (err)
            res.send(err);
        else{
            res.json({
                status: "success",
                message: 'Building details loading..',
                data: building
            });
        }
    });
};

// Handle update building info
exports.update = function (req, res) {
    Building.findOne({building_id: req.params.building_id}, function (err, building) {
        if (err)
            res.send(err);
        else if(building){
            building.building_id = req.body.building_id ? req.body.building_id : building.building_id;
            building.name = req.body.name ? req.body.name : building.name;
            building.latitude = req.body.latitude ? req.body.latitude : building.latitude;
            building.longitude = req.body.longitude ? req.body.longitude : building.longitude;

            Building.findOneAndUpdate({building_id: req.params.building_id}, {
              $set: {
                  building_id: building.building_id,
                  name: building.name,
                  latitude: building.latitude,
                  longitude: building.longitude
              }
            }, function (err) {
                if (err)
                    res.json(err);

                res.json({
                    status: "success",
                    message: 'Building Info updated',
                    data: building
                });
            });
        } else{
            res.json({
                status: "fail",
                message: "Invalid ID"
            })
        }
    });
};

// Handle delete building
exports.delete = function (req, res) {
    Building.remove({
        building_id: req.params.building_id
    },
    function (err, building) {
        if (err)
            res.send(err);
        else{
            res.json({
                status: "success",
                message: 'Building deleted'
            });
        }
    });
};
