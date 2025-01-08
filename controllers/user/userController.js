const bcrypt = require('bcryptjs')
const User = require('../../models/userSchema')

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

module.exports = {
    changePassword
}