const express = require('express')
const router = express()
const roleController = require('../controllers/admin/role/RoleController')

router.post('/createRole', roleController.createRole)
router.get('/getRole', roleController.getRole)
router.get('/getRoleById/:id', roleController.getRoleById)
router.delete('/deleteRole/:id', roleController.deleteRole)
router.put('/updateRole/:id', roleController.updateRole)
router.get('/countRole', roleController.countRole)
router.put('/deleteRoles/:id', roleController.deleteRoles)
router.post('/user/:id/assign_role', roleController.AssignRole)

module.exports = router