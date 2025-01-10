const Role = require('../models/roleSchema')
const User = require('../models/userSchema')

const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).populate('roles')
            const hasPermission = user.roles.some((role) => 
                role.permissions.includes(requiredPermission)
            )

            if(!hasPermission) {
                return res.status(403).json({ 
                    error: 'Access denied' 
                });
            }
            next()
        } catch (error) {
            res.status(500).json({ 
                error: 'Server error' 
            });
        }
    } 
}

module.exports = checkPermission