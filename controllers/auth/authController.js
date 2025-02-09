const User = require('../../models/userSchema')
const UserLogs = require('../../models/userLogsSchema')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')
const { generateAccessToken, generateRefreshToken } = require('../../utils/utils')
const { isValidEmail } = require('../../utils/utils')
const validator = require('validator')
const Permission = require("../../models/permissionSchema");
const UserPermission = require('../../models/userPermissionSchema')
const upload = require('../../middleware/multerConfig')

const register = async (req, res) => {
    upload.single('profileImage')(req, res, async (err) => {
        if (err) {
            console.log(err);

            return res.status(400).json({
                success: false,
                error: err.message,
            });
        }
        try {
            const { firstname, lastname, email, password, confirmPass, phone, address } = req.body

            if (!firstname || !lastname || !email || !password || !confirmPass) {
                return res.status(400).json({
                    success: false,
                    error: 'please fill out all fields'
                })
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid email'
                })
            }

            const isExistUser = await User.findOne({ email })

            if (isExistUser) {
                return res.status(400).json({
                    success: false,
                    error: 'Email already exists has been taken!'
                })
            } else if (password !== confirmPass) {
                return res.status(400).json({
                    success: false,
                    error: "password does'nt match",
                })
            }

            if (password.length < 10 || confirmPass.length < 10) {
                return res.status(400).json({
                    success: false,
                    error: "Password must be at least 10 characters long",
                })
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const hashConfirmPassword = await bcrypt.hash(confirmPass, 10)

            const user = new User({
                firstname,
                lastname,
                email,
                password: hashPassword,
                confirmPass: hashConfirmPassword,
                phone: phone ? phone : null,
                address: address ? address : null,
                profileImage: req.file ? `${req.file.filename}` : null,
                created_by: firstname + ' ' + lastname,
                updated_by: firstname + ' ' + lastname,

            })

            const userData = await user.save()

            const defaultPermissions = await Permission.find({
                is_default: 1
            })

            if (defaultPermissions.length > 0) {
                const permissionArray = []
                defaultPermissions.forEach((permission) => {
                    permissionArray.push({
                        permission_name: permission.permission_name,
                        permission_value: [0, 1, 2, 3]
                    })
                })

                const userPermission = new UserPermission({
                    user_id: userData._id,
                    permissions: permissionArray
                })

                await userPermission.save()
            }



            return res.status(200).json({
                success: true,
                message: "user create successfully",
                data: userData
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                error: "internal server error"
            });
        }
    })
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'please fill out all fields'
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email'
            })
        }

        const userData = await User.findOne({ email })

        if (!userData) {
            return res.status(400).json({
                success: false,
                error: "Email & Password is incorrect!",
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, userData.password)

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                error: "Email & Password is incorrect!",
            })
        }

        const accessToken = await generateAccessToken({ user: userData })
        const refreshToken = await generateRefreshToken({ user: userData })


        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })


        const result = await User.aggregate([
            {
                $match: { email: userData.email }
            },

            {
                $lookup: {
                    from: 'userpermissions',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'permissions'
                }
            },

            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    firstname: 1,
                    lastname: 1,
                    password: 1,
                    role: 1,
                    token: 1,
                    refreshToken: 1,
                    active: 1,
                    profileImage: 1,
                    permissions: {
                        $cond: {
                            if: { $isArray: '$permissions' },
                            then: { $arrayElemAt: ["$permissions", 0] },
                            else: null
                        }
                    }
                }
            },

            {
                $addFields: {
                    permissions: {
                        permissions: "$permissions.permissions"
                    }
                }
            }
        ])

        const user = await User.findOne({ active: userData.active })

        if (!user.active) {
            return res.status(400).send({
                success: false,
                error: "This account is in-active, please contact your admin",
            });
        }

        const logs = new UserLogs({
            user_id: userData._id,
            token: accessToken,

        });

        await logs.save();

        if (![0, 1, 2, 3].includes(userData.role)) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized access: invalid role.",
            });
        }


        if (userData.role === 0 && !userData.is_sub_admin) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized access: user does not have subAdmin privileges.",
            });
        }

        if (userData.role === 1 && !userData.is_sub_admin) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized access: admin does not have subAdmin privileges.",
            });
        }

        if (userData.role === 2 && !userData.is_sub_admin) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized access: superAdmin does not have subAdmin privileges.",
            });
        }

        if (userData.role === 0 || userData.role === 1 || userData.role === 2 || userData.role === 3) {
            const users = await User.findByIdAndUpdate(
                { _id: userData._id },
                { token: accessToken, refreshToken: refreshToken },
                { new: true }
            )

            let message = "Login successfully";
            if (userData.role === 0) {
                message = "User login successfully";
            } else if (userData.role === 1) {
                message = "Admin login successfully";
            } else if (userData.role === 2) {
                message = "superAdmin login successfully";
            } else if (userData.role === 3) {
                message = "subAdmin login successfully";
            }


            await users.save()

            res.status(200).json({
                success: true,
                message: message,
                data: result[0],
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const logout = async (req, res) => {
    try {
        const { userId } = req.query

        if (!userId) {
            return res.status(400).json({ message: "User ID is required for logout." });
        }

        const data = await User.updateOne(
            { _id: userId },
            { $set: { token: null } },
        )

        await UserLogs.updateOne(
            { user_id: userId },
            { $set: { token: null, logout_time: new Date() } }
        );

        if (data.nModified === 0) {
            return res.status(404).json({ message: "User not found or already logged out." });
        }

        res.clearCookie('accessToken');

        return res.status(200).json({ message: "Successfully logged out." });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: "Refresh Token required"
            })
        }

        const user = await User.findOne({ refreshToken })
        if (!user) {
            return res.status(403).json({
                success: false,
                error: "Invalid Refresh Token"
            })
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid Refresh Token" });
            }
        })

        const accessToken = jwt.sign({ user: decodedData.user }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "15m" })
        return res.status(200).json({
            success: true,
            accessToken: accessToken
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    refreshToken
}