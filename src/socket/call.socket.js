const { Socket } = require("socket.io");


module.exports = function(socket) {

    socket.on('call-start', ({room, conversationRoom}) => {
        socket.emit('call-start')
        socket.to(room).to(conversationRoom).emit('call-start')
    })

    socket.on('call-message', ({room, payload}) => {
        
    })

    socket.on('call-decline', (room) => {
        socket.to(room).emit('call-declined', room)
    })
    
    socket.on('call-received', (room) => {
        socket.to(room).emit('call-received')
    })

    socket.on('call-hangup', (room) => {
        socket.to(room).emit('call-hangup')
    })

    socket.on('call-streaming', ({room, imageUrl, person}) => {
        socket.to(room).emit('call-streaming', {room, imageUrl})
    })


     // Conversation event
     socket.on('calling', ({conversationRoom, room, person}) => {
        socket.to(conversationRoom).emit('calling', {room, person})
    })

     socket.on('calling-stop', (conversationRoom) => {
        socket.to(conversationRoom).emit('calling-stop', conversationRoom)
     })
}