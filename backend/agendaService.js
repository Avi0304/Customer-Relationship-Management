const Agenda = require('agenda');
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
// const { createSystemNotification } = require('./controllers/NotificationController');
const { sendNotificationToUser } = require('./socket');
require('dotenv').config();

// Connect to MongoDB if not already connected
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('Agenda MongoDB connected'));
}

// Create Agenda instance
const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI,
    collection: 'agendaJobs'
  }
});

// Define reminder job
agenda.define('send appointment reminder', async (job) => {
  const { appointmentId } = job.attrs.data;

  const appointment = await Appointment.findById(appointmentId).populate('user');
  if (!appointment || appointment.status === 'Cancelled') return;

  const title = 'Upcoming Appointment Reminder';
  const appointmentDate = new Date(appointment.date).toLocaleDateString();
  const message = `Reminder: Your appointment with ${appointment.customer} is scheduled on ${appointmentDate} at ${appointment.time}.`;

  // Send Email & Socket Notification
  const notification = await createSystemNotification(
    appointment.user._id,
    title,
    message,
    'appointment',
    appointment._id,
    'Appointment',
    true // sendEmail
  );

  if (notification) {
    sendNotificationToUser(appointment.user._id, notification);
  }
});

// Start Agenda
(async function () {
  await agenda.start();
})();

module.exports = agenda;
