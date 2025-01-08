const express = require('express')
const router = express()

const contactUsController = require('../controllers/contact_us/contactUsController')

router.post('/contactUs', contactUsController.AddContactUs)

module.exports = router