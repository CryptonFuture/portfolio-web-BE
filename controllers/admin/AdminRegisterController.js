const UserAdmin = require('../../models/userAdminSchema')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const upload = require('../../middleware/adminMulterConfig')

const AdminRegister = async (req, res) => {
    upload.single('AdminProfileImage')(req, res, async (err) => {
        if (err) {
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

            const isExistUser = await UserAdmin.findOne({ email })

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

            const user = new UserAdmin({
                firstname,
                lastname,
                email,
                password: hashPassword,
                confirmPass: hashConfirmPassword,
                phone: phone ? phone : null,
                address: address ? address : null,
                AdminProfileImage: req.file ? req.file.path : null,
                created_by: firstname + ' ' + lastname,
                updated_by: firstname + ' ' + lastname,

            })

            const userData = await user.save()

            return res.status(200).json({
                success: true,
                message: "user admin create successfully",
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

module.exports = {
    AdminRegister
}