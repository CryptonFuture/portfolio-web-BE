const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true
    },

    permission: [
        {
            type: String,
            required: true
        }
    ],

    is_deleted: {
        type: Boolean,
        default: 0
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Role', roleSchema)