const express = require('express')
const { verifyToken } = require('../middleware/authMiddleware')
const router = express()

const permissionController = require('../controllers/admin/permissionController')

router.post('/add_permission', permissionController.addPermission)

module.exports = router