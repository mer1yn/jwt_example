const { Router } = require('express')
const userRouter = Router()

const { Post } = require('../schemes')
const { tokenAuthMiddleware } = require('../util')

userRouter.use(tokenAuthMiddleware)
userRouter.use((req, res, next) => {
    if (!req.currentUser) {
        res.status(403).json({ msg: 'Authorization failed...' })
        return
    }
    next()
})

/**
 * @api {get} /logged/user/current Obtener usuario actual
 * @apiGroup User
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
userRouter.get('/user/current', (req, res) => res.json(req.currentUser))

/**
 * @api {get} /logged/posts?own=true Obtener posts
 * @apiGroup User
 * 
 * @apiParam {String} ggg uwuwuwuwuwuwu
 * @apiParam {Boolean} own Indica si los posts a buscar son del mismo usuario
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP 200 OK
 *      [
 *          {
 *              "_id": "7890780zxczxc....",
 *              "title": "Un título",
 *              "content": "Contenido ggg",
 *              "user": "1234567qwerty"
 *          },
 *          {
 *              "_id": "7890780zxczxc....",
 *              "title": "Otro título",
 *              "content": "Contenido uwu",
 *              "user": "1234567qwerty"
 *          }
 *      ]
 * 
 */
userRouter.get('/posts', (req, res) => {
    const { currentUser } = req
    const { own } = req.query
    const query = {}

    if (own && JSON.parse(own))
        query.user = currentUser._id

    Post.find(query)
        .populate('user')
        .then(posts => res.json(posts))
        .catch(err => res.status(500).json(err))
})

/**
 * @api {post} /logged/post Registrar nuevo post
 * @apiGroup User
 * 
 * @apiParam {String} title Título del post
 * @apiParam {String} content Contenido del post
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP 200 OK
 *      {
 *          "_id": "7890780zxczxc....",
 *          "title": "Otro título",
 *          "content": "Contenido uwu",
 *          "user": "1234567qwerty"
 *      }
 */
userRouter.post('/post', (req, res) => {
    const { currentUser } = req
    const { title, content } = req.body

    if (!title || !content) {
        res.send(400).json({ msg: 'post title or content not found in the request...' })
        return
    }
    
    new Post({ title, content, user: currentUser._id })
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(500).json(err))
})

module.exports = userRouter