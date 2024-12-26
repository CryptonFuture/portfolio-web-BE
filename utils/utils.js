const jwt = require('jsonwebtoken')

const generateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: '24h'})
    return token
}

module.exports = {
    generateAccessToken
}

