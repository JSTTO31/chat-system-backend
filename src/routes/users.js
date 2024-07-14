const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller')
const AuthMiddleware = require('../middlewares/auth.middleware')

router.get('', AuthMiddleware, UserController.getAll)
router.post('/sign-up', UserController.signUp)
router.post('/login', UserController.login)
router.post('/:userId/messages', AuthMiddleware, UserController.sendMessage)

module.exports = router