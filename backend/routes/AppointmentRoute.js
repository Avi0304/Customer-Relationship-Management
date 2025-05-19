const express = require("express");
const {
  getAllAppointment,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  upcomingAppointment,
  pastAppointment,
  sendMeetingEmail,
  saveEventId,
} = require("../controllers/AppointmentController");

const router = express.Router();

router.get("/", getAllAppointment);
router.post("/add", addAppointment);
router.put("/update/:id", updateAppointment);
router.delete("/delete/:id", deleteAppointment);
router.get("/upcoming", upcomingAppointment);
router.get("/past", pastAppointment);
router.post("/send-meeting", sendMeetingEmail);
router.post("/send-eventId/:appointmentId", saveEventId);

module.exports = router;
