// Global functions file
var axios = require('axios');

var config = require("./config")();

// Import user model
User = require('../models/userModel');
Building = require('../models/buildingModel');

function setDistance(lat1, lon1, lat2, lon2){
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var R = 6371e3; // metres
        var φ1 = lat1*Math.PI/180;
        var φ2 = lat2*Math.PI/180;
        var Δφ = (lat2-lat1)*Math.PI/180;
        var Δλ = (lon2-lon1)*Math.PI/180;

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = R * c;

        return d;
    }
}

exports.getDistance = function(location1, location2) {
    var lat1 = location1.latitude;
    var lon1 = location1.longitude;
    var lat2 = location2.latitude;
    var lon2 = location2.longitude;

    return setDistance(lat1, lon1, lat2, lon2);
};

exports.getBuilding = function(lat, lon) {
    var range = config.default.building_range;
    Building.find().exec()
      .then(function (buildings) {
          for(var x in buildings){
              var distance = setDistance(lat, lon, buildings[x].latitude, buildings[x].longitude);
              if(distance < range)
                  return buildings[x].building_id;
          }
          return null;
      })
      .catch(function (error) {
          return null;
      });

};

exports.axiosRequest = function(method, url, params, data) {
    return new Promise(function (resolve, reject) {
        // Api endpoint to update user in case it exists
        axios({
            method: method,
            url: url,
            params: params,
            data: data
        })
        .then(function (response) {
            resolve(response);
        })
        .catch(function (error) {
            reject(error);
        });
    });
}
