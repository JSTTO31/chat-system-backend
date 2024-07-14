const { default: mongoose } = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const Message = require('../models/message.model')
const Conversation = require('../models/conversation.model')
const bcrypt = require('bcrypt')

exports.getAll = async (req, res) => {
    try {
        let users = await User.find({})
        // Conversation.deleteMany({})
        // await users.forEach(async (item) => {
        //   let friends = users.filter(friend => friend._id != item._id)
        //   await friends.forEach( async(friend) => {

        //     let conversation = await Conversation.create({
        //       _id: new mongoose.Types.ObjectId(),
        //       type: 'friends', 
        //       persons: [item._id, friend._id]
        //     })

        //   })
        // })


        res.status(200).json({
            users
        })
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}

exports.signUp = async (req, res) => {
    try {
        const rounds = 10
        const password = req.body.password
        await bcrypt.genSalt(rounds, function(err, salt){
            bcrypt.hash(password, salt, async(err, hash) => {
                const result = await User.create({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                })
                const user = result.toObject()
                delete user.password
                const token = jwt.sign({userData: user}, process.env.SECRET, {expiresIn: '1h'})

                res.status(200).json({
                    user,
                    token
                })
            })
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.login = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email})
        if(!user) return res.status(422).json({errors: {email: {message: 'Sorry, its seems your email is not in our records!'}}})
        const password = req.body.password
        const compare = await bcrypt.compare(password, user.password)
        if(!compare) return res.status(422).json({errors: {password: {message: 'Invalid password. Please try again.'}}})
        user = user.toObject()
        delete user.password
        console.log(user);
        const token = jwt.sign({userData: user}, process.env.SECRET)
        res.status(200).json({
            user, 
            token
        })
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}

exports.sendMessage = async (req, res) => {
    
    try {
        let message = await Message.create({
            _id: new mongoose.Types.ObjectId(),
            text: req.body.text,
            from: req.user._id,
        })

        await User.updateOne({_id: req.params.userId}, {$push: {messages: message._id}, })

        res.status(200).json({message})
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}