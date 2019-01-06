// Deploys bot
var cron = require('node-cron');
var inquirer = require('inquirer');
var axios = require('axios');

var config = require('./server/config/config')();
var mixin = require('./server/config/mixin');

var botObj = {};

async function createBot() {
    var questions = [
      {
        name: 'botID',
        type: 'input',
        message: 'Enter botID: ',
        validate: function( value ) {
            if (value.length) {
                return true;
            } else {
                return 'Please enter botID: ';
            }
        }
      },
      {
        name: 'building_id',
        type: 'input',
        message: 'Enter building_id to assign bot: ',
        validate: function(value) {
            if (value.length) {
                return true;
            } else {
                return 'Enter building_id to assign bot: ';
          }
        }
      },
      {
        name: 'timeout',
        type: 'input',
        message: 'Set timeout to send messages: ',
        validate: function(value) {
            if (value.length) {
                return true;
            } else {
                return 'Set timeout to send messages: ';
          }
        }
      },
      {
        name: 'message',
        type: 'input',
        message: 'Set message to send periodically: ',
        validate: function(value) {
            if (value.length) {
                return true;
            } else {
                return 'Set message to send periodically: ';
          }
        }
      }
    ];

    botObj = await inquirer.prompt(questions);
    console.log(botObj);
}

createBot()
  .then(function () {
      cron.schedule('*/' + botObj.timeout + ' * * * * *', () => {
          console.log('\nSeding new message');
          var url = config.host.path + '/messages/bot/' + botObj.botID;
          var params = {};
          var data = {
              building_id: botObj.building_id,
              text: botObj.message
          };
          mixin.axiosRequest('post', url, params, data);
          console.log("Message Sent\n")
      });
  })
  .catch(function (error) {
      console.log(error);
  })
