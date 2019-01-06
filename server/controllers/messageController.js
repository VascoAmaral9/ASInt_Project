// messageController.js
// Import models
Message = require('../models/messageModel');
User = require('../models/userModel');

var mixin = require('../config/mixin');
var config = require('../config/config')();

function newMessage(sender, receiver, type, text) {
    var message = new Message();
    message.sender_id = sender;
    message.receiver_id = receiver;
    message.type = type;
    message.text = text;
    var messageID = {};

    return new Promise(function (resolve, reject) {
        message.save()
          .then(function (messageObj) {
              if(messageObj != null){
                  messageID = messageObj._id;
                  if(type === 'bot'){
                      return Promise.resolve('bot');
                  } else{
                      return User.findOneAndUpdate({istID: sender}, {
                        $push: {
                          messages: messageID
                        }
                      }).exec();
                  }
              } else{
                  console.log("Database Error");
                  reject("Database Error");
              }
          })
          .then(function (userA) {
              if(userA != null){
                  return User.findOneAndUpdate({istID: receiver}, {
                      $push: {
                          messages: messageID
                      }
                  }).exec();
              } else{
                  console.log("Database Error");
                  reject("Database Error");
              }
          })
          .then(function (userB) {
              if(userB != null){
                  console.log("New Message added with success!");
                  resolve("success");
              } else{
                  console.log("Database Error");
                  reject("Database Error");
              }
          })
          .catch(function (error) {
              reject(error);
          });
    });
}

function defineReceivers(user, activeUsers, type){
    var receivers = [];

    if(type === "range"){
        var range = user.distance_range;
        for(var x in activeUsers){
            var distance = mixin.getDistance(user.location, activeUsers[x].location);
            if(distance < range)
                receivers.push(activeUsers[x].istID);
        }
    } else if(type === "building" || type === "bot"){
        for(var x in activeUsers){
            if(activeUsers[x].location.building == user.location.building)
                receivers.push(activeUsers[x].istID);
        }
    }

    return receivers;
}

// Handle index actions
exports.index = function (req, res) {
    Message.get(function (err, messages) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else{
            res.json({
                status: "success",
                message: "Messages retrieved successfully",
                data: messages
            });
        }
    });
};

// Handle spreading message from bot through all users
exports.spreadBotMessage = function (req, res) {
    var sender = req.params.botID;
    var type = 'bot';
    // Conditions for valid message
    if(req.body.text && req.body.building_id){
        var text = req.body.text;
        var building_id = req.body.building_id;
    }
    else
        res.json({status: "failed", message: "Invalid message"});

    // All conditions met from this point forward
    User.find({
          active: true,
          'location.latitude': {$ne: null},
          'location.longitude': {$ne: null}
      }).exec()
      .then(function (activeUsers) {
          var receivers = defineReceivers({'location': {'building': building_id}}, activeUsers, type);

          for(var x in receivers){
              newMessage(sender, receivers[x], type, text);
          }
          return Promise.resolve(receivers);
      })
      .then(function (receivers) {
          res.json({
              status: "success",
              message: "Messages spreaded successfully",
              data: receivers
          });
      })
      .catch(function (error) {
          res.json({
              status: "error",
              message: error,
          });
      });
}

// Handle spreading message from user through all users
exports.spreadUserMessage = function (req, res) {
    User.findOne({istID: req.params.istID}).exec()
      .then(function (user) {
          if(user) {
              var sender = req.params.istID;

              // Conditions for valid message
              if((req.body.type === "building" || req.body.type === "range") && req.body.text){
                  var type = req.body.type;
                  var text = req.body.text;
              }
              else
                  res.json({status: "failed", message: "Invalid message"});

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
                    var receivers = defineReceivers(user, activeUsers, type);

                    for(var x in receivers){
                        newMessage(sender, receivers[x], type, text);
                    }
                    return Promise.resolve(receivers);
                })
                .then(function (receivers) {
                    res.json({
                        status: "success",
                        message: "Messages spreaded successfully",
                        data: receivers
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
}
