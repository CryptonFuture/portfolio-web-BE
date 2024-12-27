const jwt = require('jsonwebtoken')

const { config } = require('dotenv')

config({
    path: '.env',
})

const generateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '24h' })
    return token
}

function isValidEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(value);
}

module.exports = {
    generateAccessToken,
    isValidEmail
}

