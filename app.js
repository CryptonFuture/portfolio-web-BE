const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoute = require('./routes/authRoutes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))
app.use(cors())

app.use('/v1/api/auth', authRoute)

app.get('/', () => {
    console.log('Service is working');
})

module.exports = app