//
const path = require('path')
const http = require('http')
global.__basedir = __dirname

// environment variable 
const { PORT } = require('./src/constants')

// express config
const express = require('express')
const app = express()
const server = http.Server(app)
const cors = require('cors')

const authRouter = require('./src/routes/auth.router')
const userRouter = require('./src/routes/user.router')

//
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'x-access-token,content-type');
    res.setHeader('Content-Type', 'application/json');
    next();
});
app.use(express.json())

app.use('/images',express.static('images'))

app.use('/', authRouter)
app.use('/logged/', userRouter)
// app.use(tokenAuthMiddleware)

// start listening 
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))