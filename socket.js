const callSocket = require('./src/socket/call.socket')
const messageSocket = require('./src/socket/message.socket')

module.exports = (socket) => {
    socket.on('connect', () => {
        console.log('new user is connected');
    })

    socket.on('join_room', (room) => {
        console.log('someone join');
        socket.join(room)
    })

    socket.on('leave_room', (room) => {
        socket.disconnect(room)
    })


    callSocket(socket)
    messageSocket(socket)


}