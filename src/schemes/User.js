const { Schema, model } = require('mongoose')

// user model
const User = model(
    'User',
    new Schema({
        name: String,
        email: { type: String, unique: true },
        password: String,
        avatar: String
    })
)

module.exports = User