var cron = require('node-cron');
var $ = require("jquery");

var config = require('../../server/config/config')();

var istID = $("#myLocalDataObj").val();
alert(istID);

sendLocation();
cron.schedule('*/' + config.default.timeout_updateLocation + ' * * * * *', () => {
    sendLocation();
});

function showPosition(position) {
    alert("Lat: " + position.coords.latitude + "<br>Lon: " + position.coords.longitude);

    var url = config.host.path + '/' + istID + '/location';
    var data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    $.ajax({url: url,
      type: "POST",
      data: data,
      success: function(data) {
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
