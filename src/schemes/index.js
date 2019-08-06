// environment variables
const { DB_HOST } = require('../constants')

// mongoose config
const mongoose = require('mongoose')
mongoose.connect(
    `mongodb://${DB_HOST}/auth_example`, 
    { 
        useNewUrlParser: true, 
        useCreateIndex: true 
    }
)

// db
const db = mongoose.connection

// export db
module.exports.db = db
// export schemes
module.exports.User = require('./User')
module.exports.Post = require('./Post')
