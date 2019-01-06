// movementModel.js
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

var movementSchema = new Schema({
    buildingA: {
        type: String,
        required: true
    },
    buildingB: {
        type: String,
        required: true
    },
    istID: {
        type: String,
        required: true
    }
}, schemaOptions);

// Export Movement model
var Movement = module.exports = mongoose.model('movement', movementSchema);
module.exports.get = function (callback, limit) {
    Movement.find(callback).limit(limit);
}
