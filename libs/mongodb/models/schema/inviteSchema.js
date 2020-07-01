let mongoose = require('mongoose')
let timestamp = require('../plugin/timestamp')
var mongoosePaginate = require('mongoose-paginate');

let inviteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    roomId: {
        type: String,
        required: true
    },
    createdAt: Date,
    updatedAt: Date
}, { collection: 'invite'});
inviteSchema.plugin(timestamp)
inviteSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Invite', inviteSchema)