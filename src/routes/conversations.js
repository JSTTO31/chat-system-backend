const express = require('express')
const router = express.Router()
const AuthMiddleware = require('../middlewares/auth.middleware')
const Conversation = require('../models/conversation.model')
const Message = require('../models/message.model')
const { default: mongoose } = require('mongoose')

router.get('', AuthMiddleware, async (req, res) => {
    try {
        const conversations = await Conversation.find({persons: req.user._id}, {}, {sort: {updatedAt: -1}})
        .populate({path: 'persons',match: {_id: {$ne: req.user._id}}})
        .populate('messages')
        
        res.status(200).json({conversations})
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})

router.get('/:conversationId', AuthMiddleware, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({id: req.params.conversationId})
        .populate({path: 'persons',match: {_id: {$ne: req.user._id}}})
        .populate('messages')
        
        res.status(200).json({conversation})
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})

router.post('/:conversationId/send-message', AuthMiddleware, async (req, res) => {
    try {
        let message = await Message.create({
            _id: new mongoose.Types.ObjectId(),
            conversation: req.params.conversationId,
            text: req.body.text,
            from: req.user._id,
        })

        await Conversation.findOneAndUpdate({_id: req.params.conversationId}, {
            $push: {messages: message}
        })

        res.status(200).json({message})
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})


module.exports = router