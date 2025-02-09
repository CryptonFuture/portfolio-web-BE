const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },

    confirmPass: {
        type: String,
        required: true
    },

    userId: {
        type: String
    },
  
    role: {
        type: Number,
        required: true,
        default: 1
    },

    phone: {
        type: String,
    },

    address: {
        type: String,
    },

    token: {
        type: String,
        default: null
    },

    active: {
        type: Boolean,
        default: 1
    },

    verified: {
        type: Boolean,
        default: 1
    },

    is_admin: {
        type: Boolean,
        default: 1
    },

    is_super_admin: {
        type: Boolean,
        default: 1
    },

    is_sub_admin: {
        type: Boolean,
        default: 1
    },

    is_deleted: {
        type: Boolean,
        default: 0
    },
    created_by: {
        type: String,
        default: null
    },
    updated_by: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('UserAdmin', userSchema)