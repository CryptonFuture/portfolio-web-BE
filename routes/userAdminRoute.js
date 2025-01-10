const express = require('express')
const { verifyToken } = require('../middleware/authMiddleware')
const router = express()

const adminRegisterController = require('../controllers/admin/AdminRegisterController')

router.post('/AdminRegister', adminRegisterController.AdminRegister)

module.exports = router