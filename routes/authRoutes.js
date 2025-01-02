const express = require('express')
const { verifyToken } = require('../middleware/authMiddleware')
const router = express()

const authController = require('../controllers/auth/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router