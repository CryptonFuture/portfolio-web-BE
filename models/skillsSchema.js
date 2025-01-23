const mongoose = require('mongoose')

const skillsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    is_deleted: {
        type: Boolean,
        default: 0
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Skills', skillsSchema)