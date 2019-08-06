//
const fs = require('fs')
const path = require('path')

// import Schemes
const { User } = require('../schemes')

const { Router } = require('express')
const authRouter = Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jdenticon = require('jdenticon')
const { BCRYPT_SALT_ROUNDS, JWT_PASS } = require('../constants')


/**
 * @api {post} /singup Registrar nuevo usuario
 * @apiGroup Autenticacion
 * 
 * @apiParam {String} name Nombre del usuario
 * @apiParam {String} email Correo del usuario, debe ser único
 * @apiParam {String} password Contraseña del usuario
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP 200 OK
 *      {
 *          "success": true,
 *          "user": {
 *              "_id": "1234567qwerty",
 *              "name": "Marco",
 *              "email": "mail@mail.com",
 *              "avatar": "/images/blablabla.svg"
 *          }
 *      }
 */
authRouter.post('/signup', (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400).json({ msg: 'name, email or password not found in request...' })
        return
    }

    bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        .then(hash => {
            // user obj
            const user = new User({ name, email, password: hash })

            // avatar
            const svg = jdenticon.toSvg(name, 150)
            fs.writeFileSync(path.join(__basedir, 'images', `av_${user._id}.svg`), svg)
            user.avatar = `/images/av_${user._id}.svg`

            return user.save()
        })
        .then(({ _id, name, email, avatar }) => {
            res.json({
                success: true,
                user: { _id, name, email, avatar }
            })
        })
        .catch(err => res.status(500).json(err))
})

/**
 * @api {post} /login Iniciar sesion
 * @apiGroup Autenticacion
 * 
 * @apiParam {String} email Correo del usuario
 * @apiParam {String} password Contraseña del usuario
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP 200 OK
 *      {
 *          "success": true,
 *          "token": "123123123qweqweqwe....."
 *          "user": {
 *              "_id": "1234567qwerty",
 *              "name": "Marco",
 *              "email": "mail@mail.com",
 *              "avatar": "/images/blablabla.svg"
 *          }
 *      }
 */
authRouter.post('/login', (req, res) => {
    // login user
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ msg: 'email or password not found in request...' })
        return
    }

    User.findOne({ email })
        .then(user => {
            if (!user)
                throw { code: 404, msg: 'user not found...' }

            return bcrypt.compare(password, user.password)
                .then(success => ({ success, user }))
        })
        .then(({ success, user }) => {
            if (!success)
                throw { code: 400, msg: 'incorrect password...' }
            
            jwt.sign({ _id: user._id }, JWT_PASS, { expiresIn: 60*60*24 }, (err, token) => {
                if (err)
                    throw { code: 500, msg: 'could not generate token, try later...' }

                res.json({ success: true, token, user })
            })
        })
        .catch(err => {
            res.status(err.code).json({ msg: err.msg })
        })
})

module.exports = authRouter