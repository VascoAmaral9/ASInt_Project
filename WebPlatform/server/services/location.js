// Manage user location updates
var axios = require('axios');

var config = require('../config/config')();
var mixin = require('../config/mixin');

// Import user model
User = require('../models/userModel');


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
                    }).exec();
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
        axios({
            method: 'post',
            url: config.host.path + '/movements',
            data: {
                buildingA: user.location.building,
                buildingB: newBuilding,
                istID: user.istID
            }
        })
        .then(function (response) {
            if(response.data.status == "success"){
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

// Handle global update on users state
exports.globalUpdate = function (req, res) {
    User.find({
          active: true
      }).exec()
      .then(function (activeUsers) {
          for(var x in activeUsers){
              var user = activeUsers[x];
              var d = new Date();
              console.log((d - user.location.updatedAt)/1000);
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
              var newBuilding = mixin.getBuilding(user.location.latitude, user.location.longitude);
              // Creates new movement if user changes building
              if((user.location.building != newBuilding) && (user.location.building != null) && (newBuilding != null))
                  newMovement(user, newBuilding);

              user.location.building = newBuilding;
              user.active = true;
              return updateUser(user);
          } else{
              res.json({status: "failed", message: "User istID is not in the database"});
          }
      })
      .then(function (user) {
          res.json(user);
      })
      .catch(function (error) {
          res.json(error);
      });
};
