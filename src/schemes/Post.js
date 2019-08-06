const { Schema, model } = require('mongoose')

// post model
const Post = model(
    'Post',
    new Schema({
        title: String,
        content: String,
        date: Date,
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    })
)

module.exports = Post