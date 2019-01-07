// Manage queries endpoints
var axios = require('axios');

var config = require('../config/config')();
var mixin = require('../config/mixin');

// Import user model
User = require('../models/userModel');
Message = require('../models/messageModel');
Movement = require('../models/movementModel');

function getNearby(user, activeUsers, type){
    var nearbyUsers = [];

    if(type === "range"){
        var range = user.distance_range;
        for(var x in activeUsers){
            var distance = mixin.getDistance(user.location, activeUsers[x].location);
            if(distance < range)
                nearbyUsers.push(activeUsers[x].istID);
        }
    } else if(type === "building"){
        for(var x in activeUsers){
            if(activeUsers[x].location.building == user.location.building)
                nearbyUsers.push(activeUsers[x].istID);
        }
    }

    return nearbyUsers;
}

// Retrieve all messages according to query
function getMessages(req){
    return new Promise(function (resolve, reject) {
        if(req.query.building_id){
            User.find({
                active: true,
                'location.building': req.query.building_id
            }).exec()
              .then(function (usersInside) {
                  var usersInsideIds = [];
                  for(var x in usersInside)
                      usersInsideIds.push(usersInside[x].istID);
                  return Message.find({$or: [ { sender_id: { $in: usersInsideIds } }, { receiver_id: { $in: usersInsideIds} } ]}).sort({createdAt: -1}).exec();
              })
              .then(function (messages) {
                  resolve(messages);
              })
              .catch(function (error) {
                  reject(error);
              });
        } else if(req.query.istID){
            Message.find({
                $or: [
                    { sender_id: req.query.istID},
                    { receiver_id: req.query.istID }
                  ]})
            .sort({createdAt: -1}).exec()
              .then(function (messages) {
                  resolve(messages);
              })
              .catch(function (error) {
                  reject(error);
              });
        } else{
            Message.find().sort({createdAt: -1}).exec()
              .then(function (messages) {
                  resolve(messages);
              })
              .catch(function (error) {
                  reject(error);
              });
        }
    });
}

// Retrieve all movements according to query
function getMovements(req){
    return new Promise(function (resolve, reject) {
        if(req.query.building_id){
            User.find({
                active: true,
                'location.building': req.query.building_id
            }).exec()
              .then(function (usersInside) {
                  var usersInsideIds = [];
                  for(var x in usersInside)
                      usersInsideIds.push(usersInside[x].istID);
                  return Movement.find({istID: { $in: usersInsideIds } }).sort({createdAt: -1}).exec();
              })
              .then(function (movements) {
                  resolve(movements);
              })
              .catch(function (error) {
                  reject(error);
              });
        } else if(req.query.istID){
            Movement.find({istID: req.query.istID}).sort({createdAt: -1}).exec()
              .then(function (movements) {
                  resolve(movements);
              })
              .catch(function (error) {
                  reject(error);
              });
        } else{
            Movement.find().sort({createdAt: -1}).exec()
              .then(function (movements) {
                  resolve(movements);
              })
              .catch(function (error) {
                  reject(error);
              });
        }
    });
}


// Handle user queries from administrator
//  -- If no building is passed in query, all active users are retrieved
exports.getActiveUsers = function (req, res) {
    User.find({
          active: true
      }).exec()
      .then(function (activeUsers) {
          if(req.query.building_id){
              var usersInside = [];
              for(var x in activeUsers){
                  if(req.query.building_id === activeUsers[x].location.building)
                      usersInside.push(activeUsers[x]);
              }
              res.json({
                  status: "success",
                  message: "Users inside building " + req.query.building_id + " successfully",
                  data: usersInside
              });
          } else{
              res.json({
                  status: "success",
                  message: "Active users retrieved successfully",
                  data: activeUsers
              });
          }
      })
      .catch(function (error) {
          res.json({
              status: "error",
              message: error,
          });
      });
};

// Handle user function to get users nearby him
exports.getNearbyUsers = function (req, res) {
    User.findOne({istID: req.params.istID}).exec()
      .then(function (user) {
          if(user) {
              // Conditions for valid search
              if(req.query.type === "building" || req.query.type === "range")
                  var type = req.query.type;
              else
                  res.json({status: "failed", message: "Invalid request"});

              if(type === "building" && user.location.building == null)
                  res.json({status: "failed", message: "User must be inside a building"});
              if(user.location.latitude == null || user.location.longitude == null)
                  res.json({status: "failed", message: "Invalid user location"});

              // All conditions met from this point forward
              User.find({
                    active: true,
                    istID: {$ne: req.params.istID},
                    'location.latitude': {$ne: null},
                    'location.longitude': {$ne: null}
                }).exec()
                .then(function (activeUsers) {
                    var nearbyUsers = getNearby(user, activeUsers, type);

                    res.json({
                        status: "success",
                        message: "Users nearby retrieved successfully",
                        data: nearbyUsers
                    });
                })
          } else{
              res.json({
                  status: "failed",
                  message: "User istID is not in the database"
              });
          }
      })
      .catch(function (error) {
          res.json({
              status: "error",
              message: error,
          });
      });
};

// Handle retrieving logs
exports.getLogs = function (req, res) {
    var ret = {};
    getMessages(req)
      .then(function (messages) {
          ret.messages = messages;
          return getMovements(req);
      })
      .then(function (movements){
          ret.movements = movements;
          ret.status = "success";
          ret.message = "Logs retrieved successfully";
          res.json(ret);
      })
      .catch(function (error) {
          res.json({
              status: "error",
              message: error,
          });
      });
}
// Handle retrieving logs
exports.getMessages = function (req, res) {
    var ret = {};
    req.query.istID = req.params.istID;

    getMessages(req)
      .then(function (messages) {
          ret.messages = messages;
          ret.status = "success";
          ret.message = "Messages retrieved successfully";
          res.json(ret);
      })
      .catch(function (error) {
          res.json({
              status: "error",
              message: error,
          });
      });
}
