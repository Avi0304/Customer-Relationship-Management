const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required :true
        },
        message: {
            type: String,
            required: true
        },
        type : {
            type : String,
            default: 'appointment'
        },
        isRead: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('Notification', NotificationSchema)