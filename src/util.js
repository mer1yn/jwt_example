//
const jwt = require('jsonwebtoken')
// environment variables
const { JWT_PASS } = require('./constants')
// schemes
const { User } = require('./schemes')

const findUserByToken = token => new Promise((resolve, reject) => {
    jwt.verify(token, JWT_PASS, (err, decoded) => {
        if (err) {
            reject(err)
            return
        }
        resolve(User.findOne({ _id: decoded._id }).select('-password'))
        return
    })
})

// express middleware
const tokenAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization
    if (token) {
        findUserByToken(token)
            .then(user => {
                req.currentUser = user
                next()
            })
            .catch(() => next())
    } else
        next()
}

module.exports = {
    findUserByToken,
    tokenAuthMiddleware
}