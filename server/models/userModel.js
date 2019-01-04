// userModel.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

// Setup schema
let schemaOptions = {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
};

var userSchema = new Schema({
    istID: {
        type: String,
        required: true,
        unique: true
    },
    distance_range: {
        type: Number,
        default: 20,
        required: true
    },
    refresh_token: {
        type: String
    },
    access_token: {
        type: String
    },
    token_expires: {
        type: String
    }

}, schemaOptions);

// Export User model
var User = module.exports = mongoose.model('user', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}
