const User = require('../../models/userSchema')
const bcrypt = require('bcryptjs')
const { generateAccessToken } = require('../../utils/utils')

const register = async (req, res) => {
    const { name, email, password, confirmPass, phone, address } = req.body

    const isExistUser = await User.findOne({email, phone})

    if(isExistUser) {
        return res.status(400).json({
            success: false,
            error: isExistUser.phone === phone
            ? 'phone number already exists has been taken!' 
            : 'Email already exists has been taken!'
        }) 
    } else if (password !== confirmPass) {
        return res.status(400).json({
            success: false,
            error: "password does'nt match", 
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const hashConfirmPassword = await bcrypt.hash(confirmPass, 10)

    const user = new User({
        name,
        email,
        password: hashPassword,
        confirmPass: hashConfirmPassword,
        phone,
        address

    })

    const userData = await user.save()

    return res.status(200).json({
        success: true,
        message: "user create successfully",
        data: userData
    })

    

}

module.exports = {
    register
}