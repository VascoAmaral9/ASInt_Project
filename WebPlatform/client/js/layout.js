var cron = require('node-cron');
var axios = require('axios');

var config = require('../../server/config/config')();

var istID = "ist";

sendLocation();
cron.schedule('*/' + config.default.timeout_updateLocation + ' * * * * *', () => {
      sendLocation();
});

function showPosition(position) {
    alert("Lat: " + position.coords.latitude + "<br>Lon: " + position.coords.longitude);
}

function sendLocation() {
    console.log('\n Updating user location');

    var x = document.getElementById("location");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }


    var url = config.host.path + '/' + istID + '/location';
    var params = {};
    var data = {};
    //mixin.axiosRequest('post', url, params, data);
}
