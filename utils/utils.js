const jwt = require('jsonwebtoken')

const { config } = require('dotenv')

config({
    path: '.env',
})

const generateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '24h' })
    return token
}

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY)
    return refreshToken
}

function isValidEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    isValidEmail
}

