const express = require('express')
const router = express()

const profileController = require('../controllers/profile/profileController')

router.get('/getProfile', profileController.getProfile)
router.get('/getProfileById/:id', profileController.editProfile)
router.put('/createProfile/:id', profileController.createProfile)

module.exports = router