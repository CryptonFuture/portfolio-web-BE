const bcrypt = require('bcryptjs')
const User = require('../../models/userSchema')
const validator = require('validator')

const changePassword = async (req, res) => {
    try {
        const { userId } = req.query

        const { currentPass, newPass, confirmPass } = req.body

        if (!currentPass || !newPass || !confirmPass) {
            return res.status(400).json({
                success: false,
                error: 'please fill out all fields'
            })
        }

        const hashNewPassword = await bcrypt.hash(newPass, 10)
        const hashConfirmPassword = await bcrypt.hash(confirmPass, 10)

        const user = await User.findByIdAndUpdate({ _id: userId }, {
            password: hashNewPassword,
            confirmPass: hashConfirmPassword
        })

        const isPasswordMatch = await bcrypt.compare(currentPass, user.password)

        if (!user || !isPasswordMatch) {
            return res.status(400).send({
                status: false,
                error: 'invalid request',
            });
        }

        await user.save()

        return res.send({
            success: true,
            message: 'Change Password Successfully',
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}


const getUser = async () => {
    try {
        const user = await User.find()

        if (!user.length > 0) {
            return res.status(404).json({
                success: false,
                error: "No user found"
            })
        }

        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

// Hard Delete
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findByIdAndDelete({ _id: id })

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "No user Id found"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: user,
                message: 'Delete User Successfully'
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

// Soft Delete
const deleteUsers = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findByIdAndUpdate({ _id: id }, {is_deleted: 1})

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "No user Id found"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: user,
                message: 'Delete User Successfully'
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const countUser = async (req, res) => {
    try {
        const countUser = await User.countDocuments()
        return res.status(200).json({
            success: true,
            count: countUser
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}



module.exports = {
    changePassword,
    getUser,
    deleteUser,
    deleteUsers,
    countUser
}