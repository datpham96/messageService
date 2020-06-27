let mongoose = require('mongoose')
let timestamp = require('../plugin/timestamp')
var mongoosePaginate = require('mongoose-paginate');

let roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    email: {
        type: Array,
        required: true
    },
    createdAt: Date,
    updatedAt: Date
}, { collection: 'room' });
roomSchema.plugin(timestamp)
roomSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Room', roomSchema)