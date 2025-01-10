const Role = require('../../../models/roleSchema')
const User = require('../../../models/userSchema')

const createRole = async (req, res) => {
    try {
        const { name, permission } = req.body

        if (!name || !permission) {
            return res.status(400).json({
                success: false,
                error: 'please fill out all fields'
            })
        }

        const isPermission = await Role.findOne({ name })

        if (isPermission) {
            return res.status(400).json({
                success: false,
                error: 'permission name already exists'
            })
        }

        const role = new Role({
            name,
            permission
        })

        const roleData = await role.save()

        return res.status(200).json({
            success: true,
            msg: "role successfully created",
            data: roleData,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error",
        });
    }
}

const getRole = async () => {
    try {
        const role = await Role.find()

        if (!role.length > 0) {
            return res.status(404).json({
                success: false,
                error: "No role found"
            })
        }

        return res.status(200).json({
            success: true,
            data: role
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error",
        });
    }
}

const getRoleById = async (req, res) => {
    try {
        const { id } = req.params
        const role = await Role.find({ _id: id })

        if (!role) {
            return res.status(404).json({
                success: false,
                error: "No role Id found"
            })
        }

        return res.status(200).json({
            success: true,
            data: role
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

// Hard Delete
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params

        const role = await Role.findByIdAndDelete({ _id: id })

        if (!role) {
            return res.status(404).json({
                success: false,
                error: "No role Id found"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: role,
                message: 'Delete Role Successfully'
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

// soft Delete
const deleteRoles = async (req, res) => {
    try {
        const { id } = req.params

        const role = await Role.findByIdAndUpdate({ _id: id }, { is_deleted: 1 })

        if (!role) {
            return res.status(404).json({
                success: false,
                error: "No role Id found"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: role,
                message: 'Delete Role Successfully'
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const countRole = async (req, res) => {
    try {
        const countRole = await Role.countDocuments()
        return res.status(200).json({
            success: true,
            count: countRole
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const updateRole = async (req, res) => {
    try {
        const { id } = req.params

        const { name, permission } = req.body;

        if (!name || !permission) {
            return res.status(400).json({
                success: false,
                error: 'please fill out all fields',
            });
        }

        const updatedRole = await Role.findByIdAndUpdate(
            { _id: id },
            { name, permission },
            { new: true }
        );

        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                error: 'Role not found',
            });
        }


        return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: updatedRole,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

const AssignRole = async (req, res) => {
    try {
        const { roleId } = req.body
        const { userId } = req.params

        const user = User.findById(userId)

        if (!user)
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });

        const role = Role.findById(roleId)

        if (!role)
            return res.status(404).json({
                success: false,
                error: 'Role not found'
            });

        if (!user.roles.includes(roleId)) {
            user.roles.push(roleId)
            await user.save()
        }

        const updatedUser = await User.findById(userId).populate('roles')

        return res.status(200).json({
            success: true,
            data: updatedUser
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}


module.exports = {
    createRole,
    getRole,
    getRoleById,
    deleteRole,
    deleteRoles,
    countRole,
    updateRole,
    AssignRole
}