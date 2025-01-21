const mongoose = require('mongoose')

const sideBarRoutesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    role:
    {
        type: [Number],
        required: true,
        enum: [0, 1, 2, 3],   // user = 0, admin = 1, superAdmin = 2, subAdmin = 3
        default: 0
    },

    is_route_active: {
        type: Boolean,
        default: 0
    },

    is_deleted: {
        type: Boolean,
        default: 0
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('sidebarRoutes', sideBarRoutesSchema)