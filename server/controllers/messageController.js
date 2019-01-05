// messageController.js
// Import message model
Message = require('../models/messageModel');
User = require('../models/userModel');

function newMessage(sender, receiver, type, text) {
    var message = new Message();
    message.sender = sender;
    message.receiver = receiver;
    message.type = type;
    message.text = text;
    var messageID = {};

    return new Promise(function (resolve, reject) {
        message.save()
          .then(function (messageObj) {
              if(messageObj != null){
                  messageID = messageObj._id;
                  return User.findOneAndUpdate({istID: sender}, {
                      $push: {
                          messages: messageID
                      }
                  }).exec();
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
