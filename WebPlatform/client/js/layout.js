var cron = require('node-cron');
var $ = require("jquery");
var Vue = require('vue');
var VueRouter = require('vue-router');
var moment = require('moment');

Vue.use(VueRouter);

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('HH:mm:ss')
  }
});

var config = require('../../server/config/config')();

sendLocation();
cron.schedule('*/' + config.default.timeout_updateLocation + ' * * * * *', () => {
    app.sendLocation();
    app.nearbyUsers();
    app.getMessages();
});

function showPosition(position, istID) {
    var url = config.host.path + '/users/' + app.istID + '/location';
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
    stage: '',
    distance_range: '',
    message: {
        type: 'range',
        text: ''
    },
    nearbyType: 'range',
    usersNearby: [],
    messages: [],
    nearby: false,
    messageExists: false
  },
  methods: {
      init: function (){
          var _this = this;
          _this.$data.istID = $("#istID").val();
          _this.$data.distance_range = parseInt($("#range").val());
          _this.$data.stage = "start";
          _this.$data.message = {
              type: 'range',
              text: ''
          };
          _this.$data.nearbyType = 'range';
          _this.$data.nearby = false;
          _this.$data.messageExists = false;
          _this.$data.usersNearby = [];
          _this.$data.messages = [];
          console.log(_this.$data);
          setTimeout(function () {
              _this.nearbyUsers();
              _this.getMessages();
          }, 300);
      }
      changeStage: function(stage) {
          var _this = this;
          _this.$data.stage = stage;
      },
      sendMessage: function() {
          var _this = this;
          var url = config.host.path + '/messages/' + _this.$data.istID;
          if(_this.$data.message.text != ''){
              $.ajax({url: url,
                  type: "POST",
                  data: _this.$data.message,
                  success: function(data) {
                      _this.$data.message.text = '';
                      alert(data.message);
                      _this.getMessages();
                  }
              });
          } else {
              alert("Invalid Message!");
          }
      },
      setRange: function() {
          var _this = this;
          var url = config.host.path + '/users/' + _this.$data.istID;
          if(_this.$data.distance_range){
              $.ajax({url: url,
                  type: "PUT",
                  data: {
                      distance_range: _this.$data.distance_range
                  },
                  success: function(data) {
                      alert(data.message);
                  }
              });
          } else {
              alert("Invalid range!");
          }
      },
      nearbyUsers: function() {
          var _this = this;
          var url = config.host.path + '/users/' + _this.$data.istID + '/nearby';
          $.ajax({url: url,
              type: "GET",
              data: {
                  type: _this.$data.nearbyType
              },
              success: function(data) {
                  if(data.status === "success"){
                      _this.$data.usersNearby = data.data;
                      if(_this.$data.usersNearby.length > 0)
                          _this.$data.nearby = true;
                      else
                          _this.$data.nearby = false;
                  } else{
                      alert(data.message);
                      _this.$data.nearby = false;
                  }
              }
          });
      },
      getMessages: function() {
          var _this = this;
          var url = config.host.path + '/users/' + _this.$data.istID + '/messages';
          $.ajax({url: url,
              type: "GET",
              data: {},
              success: function(data) {
                  if(data.status === "success"){
                      _this.$data.messages = data.messages;
                      if(_this.$data.messages.length > 0)
                          _this.$data.messageExists = true;
                      else
                          _this.$data.messageExists = false;
                  } else{
                      alert(data.message);
                  }
              }
          });
      }
  }
});

$(document).ready(()=>{
    app.init();
});
