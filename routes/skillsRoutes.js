const express = require('express')
const router = express()

const skillsController = require('../controllers/skills/skillsController')

router.post('/addskills', skillsController.AddSkills)
router.get('/getSkills', skillsController.getSkills)
router.get('/getSkillsById/:id', skillsController.getSkillsById)
router.delete('/deleteSkills/:id', skillsController.deleteSkills)
router.put('/updateSkills/:id', skillsController.updateSkills)
router.get('/countSkills', skillsController.countSkills)
router.put('/deleteSkill/:id', skillsController.deleteSkill)

module.exports = router