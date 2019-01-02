// Server Setup
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var config = require('./config')();

// view engine setup
function initServerEngine(app) {
    app.use(logger('dev'));

    app.use(session({
      secret: "keykeykey",
      saveUninitialized: true,
      resave: true,
      cookie: {
        maxAge: 36000000,
        httpOnly: false
      },
      store: new MongoStore({
          url: config.db.path
      })
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
}

function initPath(app) {
    app.use(express.static(path.join(__dirname, '../../build/')));
}


module.exports = function () {

  let app = express();

  initServerEngine(app);
  initPath(app);

  return app;
};
