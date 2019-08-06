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
app.use(cors())
app.use(express.json())

app.use('/images',express.static('images'))

app.use('/', authRouter)
app.use('/logged/', userRouter)
// app.use(tokenAuthMiddleware)

// start listening 
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))