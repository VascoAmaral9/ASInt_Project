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

// Handle index actions
exports.index = function (req, res) {
    Movement.get(function (err, movements) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else{
            res.json({
                status: "success",
                message: "Movements retrieved successfully",
                data: movements
            });
        }
    });
};

exports.new = function (req, res) {
     var buildingA = req.body.buildingA;
     var buildingB = req.body.buildingB;
     var istID = req.body.istID;

    newMovement(buildingA, buildingB, istID)
      .then(function (status) {
          if(status == "success"){
              res.json({
                  status: "success",
                  message: "New movement created"
              });
          } else{
              res.json({
                  status: "failed",
                  message: "Database Error"
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
