// userController.js
// Import user model
User = require('../models/userModel');

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
    user.name = req.body.name;
    user.latitude = req.body.latitude;
    user.longitude = req.body.longitude;

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
    User.find({istID: req.params.istID}, function (err, user) {
        if (err)
            res.send(err);
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
            res.send(err);
        else if(user){
            user.istID = req.body.istID ? req.body.istID : user.istID;
            user.name = req.body.name ? req.body.name : user.name;
            user.latitude = req.body.latitude ? req.body.latitude : user.latitude;
            user.longitude = req.body.longitude ? req.body.longitude : user.longitude;

            User.findOneAndUpdate({istID: req.params.istID}, {
              $set: {
                  istID: user.istID,
                  name: user.name,
                  latitude: user.latitude,
                  longitude: user.longitude
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
                status: "fail",
                message: "Invalid ID"
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
            res.send(err);
        else{
            res.json({
                status: "success",
                message: 'User deleted'
            });
        }
    });
};
