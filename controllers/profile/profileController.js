const User = require('../../models/userSchema')

const createProfile = async (req, res) => {
    try {
        const { id } = req.params

        const { phone, address } = req.body

        if (!phone || !address) {
            return res.status(400).json({
                success: false,
                error: 'please fill out all fields'
            })
        }

        const user = await User.findByIdAndUpdate(
            { _id: id },
            { phone, address },
            { new: true }
        )

        const userData = await user.save()

        return res.status(200).json({
            success: true,
            message: "user profile create successfully",
            data: userData
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const editProfile = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.find({ _id: id })

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "No user profile Id found"
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

const getProfile = async (req, res) => {
    try {
        const user = await User.aggregate([
            {
                $project: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    password: 1,
                    role: 1,
                    phone: 1,
                    address: 1,
                    createdAt: 1
                }
            }
        ])

        if (!user.length > 0) {
            return res.status(404).json({
                success: false,
                error: "No user profile found"
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

module.exports = {
    createProfile,
    getProfile,
    editProfile
} 