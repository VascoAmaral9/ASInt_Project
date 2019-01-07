var cron = require('node-cron');
var $ = require("jquery");

var config = require('../../server/config/config')();

var istID = $("#myLocalDataObj").val();

sendLocation();
cron.schedule('*/' + config.default.timeout_updateLocation + ' * * * * *', () => {
    sendLocation();
});

function showPosition(position) {
    var url = config.host.path + '/users/' + istID + '/location';
    var data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    $.ajax({url: url,
      type: "POST",
      data: data,
      success: function(data) {
          console.log(data);
          console.log("Location updated!");
      }
    });
}

function sendLocation() {
    console.log('\n Updating user location');

    var x = document.getElementById("location");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
