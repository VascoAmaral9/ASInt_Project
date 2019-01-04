// Communication with fenix api
// TODO manage errors, where to go -> current: res.json(error)
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
                istID: user.istID,
                distance_range: user.distance_range ? user.distance_range : null,
                refresh_token:  user.refresh_token ? user.refresh_token : null,
                access_token: user.access_token ? user.access_token : null,
                token_expires: user.token_expires ? user.token_expires : null
            }
        })
        .then(function (response) {
            if(response.data.status == "success"){
                console.log("User updated with successs!");
                resolve(response.data.data);
            } else if(response.data.status == "failed"){
                axios({
                    method: 'post',
                    url: config.host.path + '/users',
                    data: {
                        istID: user.istID,
                        distance_range: user.distance_range ? user.distance_range : null,
                        refresh_token:  user.refresh_token ? user.refresh_token : null,
                        access_token: user.access_token ? user.access_token : null,
                        token_expires: user.token_expires ? user.token_expires : null
                    }
                })
                .then(function (response2) {
                    if(response2.data.status == "success"){
                        console.log("New user created with success");
                        resolve(response2.data.data);
                    } else {
                        throw "Database error"
                    }
                });
            } else{
                throw "Unknow error"
            }
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

function performRequest(url, method, params) {
    return new Promise(function (resolve, reject) {
        axios({
            method: method,
            url: url,
            params: params
        })
        .then(function (response) {
            resolve(response);
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

//Performs private request to fenix api and returns data
function apiPrivateRequest(endpoint, user, params) {
    var params = params ? params : {};
    var url = config.fenix.api_url + endpoint;

    params.access_token = user.access_token;

    return new Promise(function (resolve, reject) {
        performRequest(url, 'get', params)
          .then(function (response) {
              //Check if response is ok
              if(response.status == 401){
                  //Refresh token if necessary
                  refreshAccessToken(user)
                    .then(function (userObj) {
                        var user = userObj;
                        params.access_token = user.access_token;
                        return performRequest(url, 'get', params);
                    })
                    .then(function (response) {
                        if(response.status == 200){
                            return Promise.resolve(response);
                        } else{
                            reject(response);
                        }
                    });
              } else if(response.status == 200){
                  return Promise.resolve(response);
              } else {
                  reject(response);
              }
          })
          .then(function (response) {
              console.log("FENIX Api request to " + endpoint + " resolved with success");
              resolve(response.data);
          })
          .catch(function (error) {
              reject(error);
          });
    });
}


function getAccesToken(apiCode) {
    var params = {
        client_id: config.fenix.client_id,
        client_secret: config.fenix.client_secret,
        redirect_uri: config.fenix.redirect_uri,
        code: apiCode,
        grant_type: "authorization_code"
    };
    var url = config.fenix.oauth_url + '/access_token';

    return performRequest(url, 'post', params);
}

// Refreshs access_token
//    RETURNS: updated user object
function refreshAccessToken(user) {
    var params = {
        client_id: config.fenix.client_id,
        client_secret: config.fenix.client_secret,
        refresh_token: user.refresh_token,
        grant_type: "refresh_token"
    };
    var url = config.fenix.oauth_url + '/refresh_token';

    performRequest(url, 'post', params)
      .then(function (response) {
          if(response.status == 200){
              user.access_token = response.data.access_token;
              user.token_expires = response.data.expires_in;
              return updateUser();
          } else{
              //Redirects user for new login
              res.redirect(config.fenix.oauth_url + '/userdialog?client_id=' + config.fenix.client_id + '&redirect_uri=' + config.fenix.redirect_uri);
              return Promise.reject();
          }
      })
      .catch(function (error) {
          return Promise.reject(error);
      });
}

// Handle FENIX login
exports.login = function (req, res) {
    if(req.query.code){
        var user = {};
        getAccesToken(req.query.code)
          .then(function (response) {
              if(response.status == 200){
                  user.access_token = response.data.access_token;
                  user.refresh_token = response.data.refresh_token;
                  user.token_expires = response.data.expires_in;

                  return apiPrivateRequest('/person', user);
              }
              else{
                  var error = {
                    error: response.data.error,
                    error_description: response.data.error_description
                  };
                  res.json(error);
              }
          })
          .then(function (apiResponse) {
              user.istID = apiResponse.username;
              return updateUser(user);
          })
          .then(function (userObj) {
              var user = userObj;
              res.json(user);
          })
          .catch(function (error) {
              res.json(error);
          });
    } else if(req.query.error) {
        //TODO deal with error
        res.json("Didn't validate fenix");
    } else{
        res.redirect(config.fenix.oauth_url + '/userdialog?client_id=' + config.fenix.client_id + '&redirect_uri=' + config.fenix.redirect_uri);
    }
}
