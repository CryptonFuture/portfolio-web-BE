const express = require('express')
const userController = require('../controllers/user/userController')

const router = express()

router.put('/changePassword', userController.changePassword)

module.exports = router