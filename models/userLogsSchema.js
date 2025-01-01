const mongoose = require('mongoose')

const userLogsSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },

    login_time: {
        type: Date,
        default: new Date().getTime()
    },

    logout_time: {
        type: String,
        default: null,
    },

    token: {
        type: String,
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('UserLogs', userLogsSchema)