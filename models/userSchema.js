const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    confirmPass: {
        type: String,
        required: true
    },

    role: {
        type: Number,
        required: true,
        default: 0
    },

    phone: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    token: {
        type: String,
        default: null
    },

    active: {
        type: Boolean,
        default: 0
    },

    verified: {
        type: Boolean,
        default: 1
    },

    is_admin: {
        type: Boolean,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)