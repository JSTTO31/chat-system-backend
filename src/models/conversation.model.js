const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConversationSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    persons: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    messages: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Message'
        }
    ],
    type: {
        type: String,
        required: true
    }
}, {timestamps: true})



module.exports = mongoose.model('Conversation', ConversationSchema)