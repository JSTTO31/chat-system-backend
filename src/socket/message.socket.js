const mongoose = require('mongoose')
const Message = require('../models/message.model')
const Conversation = require('../models/conversation.model')

module.exports = function(socket) {
    socket.on("typing", ({room, person_id}) => {
        socket.to(room).emit('typing', {room, person_id})
    })

    socket.on("stop-typing", ({room, person_id}) => {
        socket.to(room).emit('stop-typing', {room, person_id})
    })

    socket.on("send-message", async ({room, message}) => {
        try {
            const newMessage = await Message.create({_id: new mongoose.Types.ObjectId(), ...message})
            await Conversation.findByIdAndUpdate({_id: room}, {$push: {messages: newMessage}})

            socket.emit('message', ({room, message: newMessage}))
            socket.to(room).emit('message', ({room, message: newMessage}))

            return newMessage

        } catch (error) {
            console.log(error)
        }
    })
}