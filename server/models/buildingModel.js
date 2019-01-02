// buildingModel.js
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
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
}, schemaOptions);

// Export Building model
var Building = module.exports = mongoose.model('building', buildingSchema);
module.exports.get = function (callback, limit) {
    Building.find(callback).limit(limit);
}
