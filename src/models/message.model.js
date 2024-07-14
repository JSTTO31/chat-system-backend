const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MessageSchema = new Schema({
    _id: Schema.Types.ObjectId,
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    text: {
        type: String, 
        required: true,
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, {timestamps: true})


module.exports = mongoose.model('Message', MessageSchema)