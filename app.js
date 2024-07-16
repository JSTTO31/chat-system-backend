const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

require("dotenv").config()

mongoose.connect(process.env.MONGO_URI)
const app = express()
const server = http.createServer(app)
const Message = require('./src/models/message.model')
const Conversation = require('./src/models/conversation.model')
const userRoutes = require('./src/routes/users')
const conversationRoutes = require('./src/routes/conversations')
const socket = require('socket.io')
const io = new socket.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        allowedHeaders: 'Origin, X-Request-With, Content-Type, Accept, Authorization'
    }, 
    transports: ['polling', 'websocket'],

})
const events = require('./socket')


io.on('connection', events)


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Method', '*')

    next()
})
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/api/users/', userRoutes)
app.use('/api/conversations', conversationRoutes)





server.listen(3001)