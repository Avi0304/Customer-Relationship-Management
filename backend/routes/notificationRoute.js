const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')

//  GET /api/notification
router.get('/', async (req, res) => {
    try {
    const notifications = await Notification.find().sort({createdAt: -1})
    res.status(200).json(notifications)
    } catch (error) {
     res.status(200).json({message: 'Error fetching notification', error})
    }
}) 

// PATCH /api/notification/read/:id
router.patch('/read/:id', async(req, res) => {
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            req.params.id,
            {isRead: true},
            {new: true}
        )
        if(!updatedNotification)
            return res.status(404).json({message: 'Notification not found'})
        res.status(200).json({updatedNotification})
    } catch (error) {
        res.status(500).json({message:'Error updating notification', error})
    }
})

// PATCH /api/notificatin/read-all
// Mark all notification as read
router.patch('/read-all', async (req, res) => {
    try {
        await Notification.updateMany({isRead: false}, {isRead: true})
        res.status(200).json({message: 'All notification mark as read'})
    } catch (error) {
        res.status(500).json({message: 'Error updating notification', error})
    }
})

router.delete('/clear-all', async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.status(200).json({ message: 'All notifications cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing notifications', error });
    }
});
module.exports = router
