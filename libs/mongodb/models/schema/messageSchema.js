let mongoose = require('mongoose')
let timestamp = require('../plugin/timestamp')
var mongoosePaginate = require('mongoose-paginate');

let messageSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    },
    type: {
        type: String,
        required: true
    },
    typeData: {
        type: Object
    },
    content: {
        type: String
    },
    roomId: {
        type: String,
        required: true
    },
    createdAt: Date,
    updatedAt: Date
}, { collection: 'message'});
messageSchema.plugin(timestamp)
messageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Message', messageSchema)