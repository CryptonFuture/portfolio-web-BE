const mongoose = require('mongoose')

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    contact_no: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    is_deleted: {
        type: Boolean,
        default: 0
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('ContactUs', contactUsSchema)