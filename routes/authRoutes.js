const express = require('express')
const router = express()

const authController = require('../controllers/auth/authController')

router.post('/register', authController.register)

module.exports = router