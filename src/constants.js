//
const dotenv = require('dotenv').config().parsed

// environment variables
const { HOST, DB_HOST, JWT_PASS } = dotenv
const BCRYPT_SALT_ROUNDS = parseInt(dotenv.BCRYPT_SALT_ROUNDS)
const PORT = parseInt(dotenv.PORT)

module.exports = {
    HOST,
    DB_HOST,
    JWT_PASS,
    BCRYPT_SALT_ROUNDS,
    PORT
}