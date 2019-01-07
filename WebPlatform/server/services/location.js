// Manage user location updates
var axios = require('axios');

var config = require('../config/config')();
var mixin = require('../config/mixin');

// Import user model
User = require('../models/userModel');
Movement = require('../models/movementModel');
Message = require('../models/messageModel');


// Saves/updates user in database
//    RETURNS: updated user object
function updateUser(user) {
    return new Promise(function (resolve, reject) {
        // Api endpoint to update user in case it exists
        axios({
            method: 'put',
            url: config.host.path + '/users/' + user.istID,
            data: {
                location:  {
                    latitude: user.location.latitude,
                    longitude: user.location.longitude,
                    building: user.location.building
                },
                active: user.active
            }
        })
        .then(function (response) {
            if(response.data.status == "success"){
                if(user.active == false){
                    User.findOneAndUpdate({istID: user.istID}, {
                      $set: {
                          messages: [],
                          movements: []
                      }
                    }).exec()
                      .then(function (user) {
                          Movement.deleteMany({istID: user.istID}).exec();
                          Message.deleteMany({receiver_id: user.istID}).exec();
                      });
                }
                console.log("User updated with successs!");
                resolve(response.data.data);
            } else{
                throw "Unknow error"
            }
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

// Creates new movement
function newMovement (user, newBuilding) {
    return new Promise(function (resolve, reject) {
        // Api endpoint to update user in case it exists
        var buildingA = user.location.building ? user.location.building : "Outside";
        var buildingB = newBuilding ? newBuilding : "Outside";
        axios({
            method: 'post',
            url: config.host.path + '/movements',
            data: {
                buildingA: buildingA,
                buildingB: buildingB,
                istID: user.istID
            }
        })
        .then(function (response) {
            if(response.data.status == "success"){
                console.log("New movement added with successs!");
                resolve(response.data.data);
            } else{
                throw "Unknow error"
            }
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

// Handle global update on users state
exports.globalUpdate = function (req, res) {
    User.find({
          active: true
      }).exec()
      .then(function (activeUsers) {
          for(var x in activeUsers){
              var user = activeUsers[x];
              var d = new Date();
              if((d - user.location.updatedAt)/1000 > config.default.timeout_activeUser){
                  user.location.latitude = null;
                  user.location.longitude = null;
                  user.location.building = null;
                  user.active = false;
                  updateUser(user);
              }
          }
          res.json({status: "success"});
      })
      .catch(function (error) {
          res.json(error);
      });
};

exports.userUpdate = function (req, res) {
    User.findOne({istID: req.params.istID}).exec()
      .then(function (user) {
          if(user){
              if(!(req.body.latitude && req.body.longitude))
                  res.json({status: "failed", message: "No coordinates given"});

              // Ready to set user updated location
              user.location.latitude = parseFloat(req.body.latitude);
              user.location.longitude = parseFloat(req.body.longitude);
              mixin.getBuilding(user.location.latitude, user.location.longitude)
                .then(function (newBuilding){
                    // Creates new movement if user changes building
                    if((user.location.building != newBuilding))
                        newMovement(user, newBuilding);

                    user.location.building = newBuilding;
                    user.active = true;
                    return updateUser(user);
                })
                .then(function (user) {
                    res.json(user);
                })
                .catch(function (error) {
                    res.json(error);
                });
          } else{
              res.json({status: "failed", message: "User istID is not in the database"});
          }
      })
      .catch(function (error) {
          res.json(error);
      });
};
