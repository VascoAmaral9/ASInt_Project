// buildingModel.js
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

var buildingSchema = new Schema({
    building_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    latitude: {
        type: Float,
        required: true,
        max: 90,
        min: -90
    },
    longitude: {
        type: Float,
        required: true,
        max: 180,
        min: -180
    }
}, schemaOptions);

// Export Building model
var Building = module.exports = mongoose.model('building', buildingSchema);
module.exports.get = function (callback, limit) {
    Building.find(callback).limit(limit);
}
