const mongoose = require('mongoose')

const userPermissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    permissions: [
        {
            permission_name: String,
            permission_value: [Number]
        }
    ]

}, {
    timestamps: true
})

module.exports = mongoose.model('userPermission', userPermissionSchema)