// Manage user location updates
var axios = require('axios');

var config = require("../config/config")();

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
                    latitude: user.latitude,
                    longitude: user.longitude,
                    building: user.building
                },
                active: user.active
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
exports.globalUserUpdate = function (req, res) {
  User.find({
        active: true
    }).exec()
    .then(function (activeUsers) {
        
    })
}
