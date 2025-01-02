const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    const token = 
        req.body.token || req.body.query || req.headers["authorization"]

        if(!token) {
            return res.status(401).json({
                success: false,
                msg: "A token is required for authentication",
            })
        }

       try {
           const bearer = token.split(" ")
           const bearerToken = bearer[1]

           const decodedData = jwt.verify(bearerToken, process.env.SECRET_KEY)
           req.user = decodedData.user

       } catch (error) {
       
        
           return res.status(400).json({
                
               success: false,
               msg: "invalid token",
           });
       }
       return next()
}

module.exports = {
    verifyToken
}