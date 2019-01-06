// userController.js
// Import user model
User = require('../models/userModel');

var config = require("../config/config")();


// Handle index actions
exports.index = function (req, res) {
    User.get(function (err, users) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else{
            res.json({
                status: "success",
                message: "Users retrieved successfully",
                data: users
            });
        }
    });
};

// Handle create user actions
exports.new = function (req, res) {
    var user = new User();
    user.istID = req.body.istID;
    user.active = false;
    user.distance_range = req.body.distance_range  ? req.body.distance_range : config.default.user_range;
    user.refresh_token = req.body.refresh_token  ? req.body.refresh_token : null;
    user.access_token = req.body.access_token  ? req.body.access_token : null;
    user.token_expires = req.body.token_expires  ? req.body.token_expires : null;

    // save the user and check for errors
    user.save(function (err) {
        if (err)
            res.json(err);
        else{
            res.json({
                status: "success",
                message: 'New user created!',
                data: user
            });
        }
    });
};

// Handle view user info
exports.view = function (req, res) {
    User.findOne({istID: req.params.istID}, function (err, user) {
        if (err)
            res.json(err);
        else{
            res.json({
                status: "success",
                message: 'User details loading..',
                data: user
            });
        }
    });
};

// Handle update user info
exports.update = function (req, res) {
    User.findOne({istID: req.params.istID}, function (err, user) {
        if (err)
            res.json(err);
        else if(user){
            user.istID = req.body.istID ? req.body.istID : user.istID;
            user.active = req.body.active ? req.body.active : user.active;
            user.distance_range = req.body.distance_range ? req.body.distance_range : user.distance_range;
            user.refresh_token = req.body.refresh_token ? req.body.refresh_token : user.refresh_token;
            user.access_token = req.body.access_token ? req.body.access_token : user.access_token;
            user.token_expires = req.body.token_expires ? req.body.token_expires : user.token_expires;
            user.location.latitude = req.body.location.latitude ? req.body.location.latitude : user.location.latitude;
            user.location.longitude = req.body.location.longitude ? req.body.location.longitude : user.location.longitude;
            user.location.building = req.body.location.building ? req.body.location.building : user.location.building;
            user.location.updatedAt = req.body.location ? Date.now() : user.location.updatedAt; //TODO check if latitude == null, if it updates

            User.findOneAndUpdate({istID: req.params.istID}, {
              $set: {
                  istID: user.istID,
                  distance_range: user.distance_range,
                  refresh_token: user.refresh_token,
                  access_token: user.access_token,
                  token_expires: user.token_expires,
                  location: {
                    latitude: user.location.latitude,
                    longitude: user.location.longitude,
                    building: user.location.building,
                    updatedAt: user.location.updatedAt
                  }
              }
            }, function (err) {
                if (err)
                    res.json(err);

                res.json({
                    status: "success",
                    message: 'User Info updated',
                    data: user
                });
            });
        } else{
            res.json({
                status: "failed",
                message: "User istID is not in the database"
            })
        }
    });
};

// Handle delete user
exports.delete = function (req, res) {
    User.remove({
        istID: req.params.istID
    },
    function (err, user) {
        if (err)
            res.json(err);
        else{
            res.json({
                status: "success",
                message: 'User deleted'
            });
        }
    });
};
