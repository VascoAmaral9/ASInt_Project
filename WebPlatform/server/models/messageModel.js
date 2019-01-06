// messageModel.js
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

var messageSchema = new Schema({
    sender_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['building', 'range', 'bot']
    }
}, schemaOptions);

// Export Message model
var Message = module.exports = mongoose.model('message', messageSchema);
module.exports.get = function (callback, limit) {
    Message.find(callback).limit(limit);
}
