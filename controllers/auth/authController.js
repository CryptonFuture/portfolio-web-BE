const User = require('../../models/userSchema')
const bcrypt = require('bcryptjs')
const { generateAccessToken } = require('../../utils/utils')
const { isValidEmail } = require('../../utils/utils')
const validator = require('validator')

const register = async (req, res) => {
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
            created_by: firstname + ' ' + lastname,
            updated_by: firstname + ' ' + lastname,

        })

        const userData = await user.save()

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
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

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

        const user = await User.findOne({ active: userData.active })

        const isAdmin = await User.findOne({ is_admin: userData.is_admin })

        if (!user.active) {
            return res.status(400).send({
                success: false,
                error: "This account is in-active, please contact your admin",
            });
        }

        if (!isAdmin.is_admin) {
            return res.status(400).send({
                success: false,
                error: "user is not admin",
            });
        }

        const users = await User.findByIdAndUpdate(
            { _id: userData._id },
            { token: accessToken },
            { new: true }
        )

        await users.save()

        return res.status(200).json({
            success: true,
            message: "login successfully",
            data: userData,
            accessToken: accessToken,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

module.exports = {
    register,
    login
}