// userModel.js
var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 6);
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
    active: {
        type: Boolean,
        default: false
    },
    distance_range: {
        type: Number,
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
    },
    location: {
        latitude: {
            type: Float,
            max: 90,
            min: -90
        },
        longitude: {
            type: Float,
            max: 180,
            min: -180
        },
        building : {
            type: String
        },
        updatedAt: {
            type: Date
        }
    },
    movements: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    messages: {
        type: [Schema.Types.ObjectId],
        default: []
    }
}, schemaOptions);

// Export User model
var User = module.exports = mongoose.model('user', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}
