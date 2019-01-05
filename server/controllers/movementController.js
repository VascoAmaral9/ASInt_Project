// movementController.js
// Import movement model
Movement = require('../models/movementModel');
User = require('../models/userModel');

function newMovement(buildingA, buildingB, istID) {
    var movement = new Movement();
    movement.buildingA = buildingA;
    movement.buildingB = buildingB;
    movement.istID = istID;

    return new Promise(function (resolve, reject) {
        movement.save()
          .then(function (movementObj) {
              if(movementObj != null){
                  return User.findOneAndUpdate({istID: istID}, {
                      $push: {
                          movements: movementObj._id
                      }
                  }).exec();
              } else{
                  console.log("Database Error");
                  reject("Database Error");
              }
          })
          .then(function (user) {
              if(user != null){
                  console.log("New Movement added with success!");
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
