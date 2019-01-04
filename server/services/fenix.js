// Communication with fenix api
var axios = require('axios');

var config = require("../config/config")();

// Import user model
User = require('../models/userModel');

function getAccesToken(apiCode) {
    return new Promise(function (resolve, reject) {
        axios({
            method:'post',
            url: config.fenix.oauth_url + '/access_token',
            params: {
                client_id: config.fenix.client_id,
                client_secret: config.fenix.client_secret,
                redirect_uri: config.fenix.redirect_uri,
                code: apiCode,
                grant_type: "authorization_code"
            },
            responseType:'json'
        })
        .then(function (response) {
            resolve(response);
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

function refreshAccessToken(user) {
    return new Promise(function (resolve, reject) {
        axios({
            method:'post',
            url: config.fenix.oauth_url + '/refresh_token',
            params: {
                client_id: config.fenix.client_id,
                client_secret: config.fenix.client_secret,
                refresh_token: user.refresh_token,
                grant_type: "refresh_token"
            },
            responseType:'json'
        })
        .then(function (response) {
            resolve(response);
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

// Handle FENIX login
exports.login = function (req, res) {
    if(req.query.code){
        getAccesToken(req.query.code)
        .then(function (response) {
            res.json(response.data)
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
