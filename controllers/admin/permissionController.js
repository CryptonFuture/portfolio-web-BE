const Permission = require('../../models/permissionSchema')

const addPermission = async (req, res) => {
    try {
        const { permission_name, is_default } = req.body

        const isExist = await Permission.findOne({ permission_name })

        if (isExist) {
            return res.status(400).json({
                success: false,
                error: "permission name already exists",
            });
        }

        const permission = new Permission({
            permission_name,
            is_default
        })

        const userPermission = await permission.save()

        return res.status(200).json({
            success: true,
            msg: "permission successfully",
            data: userPermission,
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            error: "internal server error",
        });
    }
}

module.exports = {
    addPermission
}