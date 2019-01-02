// Database connection setup
"use strict";

var mongoose = require("mongoose");

var config = require("../config/config")();

mongoose.set('debug', true);

module.exports = function(app) {
    let db;

    mongoose.Promise = global.Promise;
    if (mongoose.connection.readyState !== 1) {
        console.log("Connecting to Mongo " + config.db.path + "...");
        db = mongoose.connect(config.db.path, config.db.options, function mongoAfterConnect(err) {
            if (err) {
                console.log("Could not connect to MongoDB!");
                return err;
            } else {
                console.log('Database connected!');
            }
        });

        mongoose.connection.on("error", function mongoConnectionError(err) {
            if (err.message.code === "ETIMEDOUT") {
                console.warn("Mongo connection timeout!", err);
                setTimeout(() => {
                    mongoose.connect(config.db.path, config.db.options);
                }, 1000);
                return;
            }

            console.log("Could not connect to MongoDB!");
        });

    } else {
        console.log("Mongo already connected.");
        db = mongoose;
    }

    return db;
};
