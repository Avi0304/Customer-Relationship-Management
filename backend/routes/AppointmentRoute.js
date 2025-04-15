const express = require('express');
const {getAllAppointment, addAppointment, updateAppointment, deleteAppointment ,upcomingAppointment, pastAppointment, sendMeetingEmail, saveEventId} = require('../controllers/AppointmentController');

const router = express.Router();

// route for get all appointment
router.get('/', getAllAppointment);

// route for add appointment
router.post('/add',addAppointment);

// route for update
router.put('/update/:id', updateAppointment);

// route for delete
router.delete('/delete/:id', deleteAppointment);

// route for upcoming appointment
router.get('/upcoming', upcomingAppointment);

//  route for past upcoming 
router.get('/past', pastAppointment);

router.post('/send-meeting', sendMeetingEmail);

router.post('/send-eventId/:appointmentId', saveEventId);

module.exports = router;