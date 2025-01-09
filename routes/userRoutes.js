const express = require('express')
const userController = require('../controllers/user/userController')

const router = express()

router.put('/changePassword', userController.changePassword)
router.get('/getUser', userController.getUser)
router.delete('/deleteUser/:id', userController.deleteUser)
router.put('/deleteUsers/:id', userController.deleteUsers)
router.get('/countUser', userController.countUser)



module.exports = router