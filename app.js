const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoute = require('./routes/authRoutes')
const permissionRoute = require('./routes/permissionRoutes')
const userRoute = require('./routes/userRoutes')
const contactUsRoute = require('./routes/contactUsRoutes')
const profileRoute = require('./routes/profileRoutes')
const userAdminRoute = require('./routes/userAdminRoute')
const roleRoute = require('./routes/roleRoutes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.use('/v1/api/auth', authRoute)
app.use('/v1/api/permission', permissionRoute)
app.use('/v1/api/user', userRoute)
app.use('/v1/api/contact', contactUsRoute)
app.use('/v1/api/profile', profileRoute)
app.use('/v1/api/admin', userAdminRoute)
app.use('/v1/api/role', roleRoute)

app.get('/', () => {
    console.log('Service is working');
})

module.exports = app