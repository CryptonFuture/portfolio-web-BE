const express = require('express')
const router = express()

const contactUsController = require('../controllers/contact_us/contactUsController')

router.post('/contactUs', contactUsController.AddContactUs)
router.get('/getContactUs', contactUsController.getContactUs)
router.get('/getContactUsById/:id', contactUsController.getContactUsById)
router.delete('/deleteContactUs/:id', contactUsController.deleteContactUs)
router.put('/updateContactUs/:id', contactUsController.UpdateContactUs)
router.get('/countContactUs', contactUsController.countContactUs)
router.put('/deleteContact/:id', contactUsController.deleteContact)

module.exports = router