const onlyAdminAccess = async (req, res, next) => {
    try {
        if (req.user.role != 1) {
            return res.status(400).json({
                
                success: false,
                error: "You haven't permission to access this route!",
            });
        }
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            error: "internal server error",
        });
    }

    return next();
};

module.exports = {
    onlyAdminAccess,
};
