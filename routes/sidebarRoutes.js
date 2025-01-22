const express = require('express')
const sideBarRoutesController = require('../controllers/sideBarRoutes/sideBarRoutesController')

const router = express()

router.post('/getSidebarRoutes', sideBarRoutesController.getSidebarRoutes)

module.exports = router