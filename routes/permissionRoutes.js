const express = require('express')
const { verifyToken } = require('../middleware/authMiddleware')
const { onlyAdminAccess } = require('../middleware/adminMiddleware')

const router = express()

const permissionController = require('../controllers/admin/permissionController')

router.post('/add_permission', verifyToken, onlyAdminAccess, permissionController.addPermission)

module.exports = router