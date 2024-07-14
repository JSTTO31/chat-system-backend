const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true,
    },
    password: {
        type: String,
        min: [8, 'The password must be atleast 8 characters!']
    },
}, {timestamps: true})


UserSchema.path('email').validate(async (value) => {
    const count = await mongoose.models.User.countDocuments({email: value})
    return !count
}, 'Email already exists!')


module.exports = mongoose.model('User', UserSchema)