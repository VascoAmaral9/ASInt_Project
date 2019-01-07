var cron = require('node-cron');
var $ = require("jquery");
var Vue = require('vue');
var VueRouter = require('vue-router');

Vue.use(VueRouter);

var config = require('../../server/config/config')();

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

    var x = document.getElementById("app");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

var app = new Vue({
  el: '#app',
  data: {
    istID: '',
    stage: ''
  },
  methods: {
      init: function (){
          var _this = this;
          _this.$data.istID = $("#istID").val();
          _this.$data.stage = "start";
          console.log(_this.$data);
      },
      changeStage: function(stage) {
          var _this = this;
          _this.$data.stage = stage;
      }
  }
});

$(document).ready(()=>{
    app.init();
});
