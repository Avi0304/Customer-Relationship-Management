const Appointment = require('../models/Appointment');
const nodemailer = require("nodemailer");
const { createNotification } = require('../utils/notificationService');

// Get All Appointment
const getAllAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });


    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment._doc, // Spread existing data
      date: appointment.date.toISOString().split("T")[0], // Format date to YYYY-MM-DD
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ message: "Error getting Appointment", error });
  }
};


// Add Appointment
const addAppointment = async (req, res) => {
  try {
    let { time } = req.body;

    // Convert 24-hour format to 12-hour format with AM/PM
    const convertTo12HourFormat = (time) => {
      let [hours, minutes] = time.split(":");
      let period = "AM";

      hours = parseInt(hours, 10);

      if (hours >= 12) {
        period = "PM";
        if (hours > 12) hours -= 12;
      } else if (hours === 0) {
        hours = 12;
      }

      return `${hours}:${minutes} ${period}`;
    };

    const formattedTime = convertTo12HourFormat(time);

    // Create new appointment with formatted time
    const newAppointment = new Appointment({
      ...req.body,
      time: formattedTime, // Save time in 12-hour format
    });

    const savedAppointment = await newAppointment.save();

    await createNotification({
      title: 'New Appointment Scheduled',
      message: `Appointment scheduled for ${savedAppointment.customer} on ${savedAppointment.date} at ${savedAppointment.time}`,
      type: 'appointment',
    });
    
    res.status(201).json({
      message: "Appointment Added Successfully...",
      savedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in Adding Appointments",
      error,
    });
  }
};


// update Appointmetn
// const updateAppointment = async (req, res) => {
//   try {
//     const { time } = req.body;

//     // Convert 24-hour format to 12-hour format with AM/PM if time is provided
//     const convertTo12HourFormat = (time) => {
//       if (!time) return null; // If no time is provided, return null

//       let [hours, minutes] = time.split(":");
//       let period = "AM";

//       hours = parseInt(hours, 10);

//       if (hours >= 12) {
//         period = "PM";
//         if (hours > 12) hours -= 12;
//       } else if (hours === 0) {
//         hours = 12;
//       }

//       return `${hours}:${minutes} ${period}`;
//     };

//     if (time) {
//       req.body.time = convertTo12HourFormat(time);
//     }

//     // Update appointment
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedAppointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.status(200).json({
//       message: "Appointment updated successfully",
//       appointment: updatedAppointment,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating appointment", error });
//   }
// };

const updateAppointment = async (req, res) => {
  try {
    const { time, status } = req.body;

    // Convert 24-hour format to 12-hour format with AM/PM if time is provided
    const convertTo12HourFormat = (time) => {
      if (!time) return null;
      let [hours, minutes] = time.split(":");
      let period = "AM";

      hours = parseInt(hours, 10);
      if (hours >= 12) {
        period = "PM";
        if (hours > 12) hours -= 12;
      } else if (hours === 0) {
        hours = 12;
      }

      return `${hours}:${minutes} ${period}`;
    };

    if (time) {
      req.body.time = convertTo12HourFormat(time);
    }

    // Fetch original appointment before update
    const originalAppointment = await Appointment.findById(req.params.id);
    if (!originalAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const oldStatus = originalAppointment.status;
    const oldTime = originalAppointment.time;

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Notification: Status changed
    if (status && status !== oldStatus) {
      await createNotification({
        title: 'Appointment Status Updated',
        message: `Appointment for ${updatedAppointment.customer} changed from ${oldStatus} to ${status}`,
        type: 'appointment',
      });
    }

    // Notification: Time changed
    if (req.body.time && req.body.time !== oldTime) {
      await createNotification({
        title: 'Appointment Time Updated',
        message: `Appointment for ${updatedAppointment.customer} moved from ${oldTime} to ${req.body.time}`,
        type: 'appointment',
      });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Error updating appointment", error });
  }
};



// delete
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment Deleted Successfully...' })
  } catch (error) {
    res.status(500).json({ message: 'Error in delete Appointment: ', error })
  }
}

// upcoming Appointment
const upcomingAppointment = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = await Appointment.find({ date: { $gte: today } }).sort({ date: 1 });

    const formattedUpcoming = upcoming.map((appointment) => ({
      ...appointment._doc, // Spread existing data
      date: appointment.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD
    }));

    res.status(200).json({ message: 'Upcoming Appointment: ', upcomingappointment: formattedUpcoming });
  } catch (error) {
    res.status(500).json({ message: 'Error in fetching Upcoming Appointments: ', error })
  }
}

//past Appointment
const pastAppointment = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const past = await Appointment.find({ date: { $lt: today } }).sort({ date: -1 });

    const formattedPast = past.map((appointment) => ({
      ...appointment._doc, // Spread existing data
      date: appointment.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD
    }));

    res.status(200).json({ message: 'Past Appointment: ', pastappointment: formattedPast });
  } catch (error) {
    res.status(500).json({ message: 'Error in fetching the past appointment: ', error })
  }
}

const sendMeetingEmail = async (req, res) => {
  const { email, customer, contact, type, date, time, duration, meetLink } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
    const mailOptions = {
      from: `"CRM Appointments" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `📅 Meeting Scheduled: ${customer} & ${contact}`,
      html: `
        <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; background-color: #f4f7fa; border-radius: 8px; padding: 30px; color: #333;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #0F62FE; margin-bottom: 8px;">Google Meet Invitation</h2>
            <p style="margin: 0; font-size: 16px;">You have a new appointment scheduled</p>
          </div>
    
          <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px;">Hello <strong>${contact}</strong>,</p>
            <p style="font-size: 15px;">We’re confirming your appointment. Below are your meeting details:</p>
            
            <table style="width: 100%; font-size: 15px; border-collapse: collapse; margin: 15px 0;">
              <tr>
                <td style="padding: 8px; font-weight: 600;">👤 Customer</td>
                <td style="padding: 8px;">${customer}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: 600;">📂 Type</td>
                <td style="padding: 8px;">${type}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: 600;">📅 Date</td>
                <td style="padding: 8px;">${date}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: 600;">⏰ Time</td>
                <td style="padding: 8px;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: 600;">⏳ Duration</td>
                <td style="padding: 8px;">${duration} minutes</td>
              </tr>
            </table>
    
            <div style="text-align: center; margin: 30px 0;">
              <a href="${meetLink}" target="_blank" style="background-color: #0F62FE; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; display: inline-block;">Join Google Meet</a>
            </div>
    
            <p style="font-size: 14px;">Make sure to join the meeting at the scheduled time. If you have any questions or need to reschedule, please contact us.</p>
          </div>
    
          <div style="text-align: center; font-size: 13px; color: #999; margin-top: 30px;">
            <p>Thank you for using our CRM Scheduler.</p>
            <p>— CRM Appointments Team</p>
            <p style="font-size: 12px;">This is an automated message. Please do not reply.</p>
          </div>
        </div>
      `,
    };
    

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
}

module.exports = { getAllAppointment, addAppointment, updateAppointment, deleteAppointment, upcomingAppointment, pastAppointment, sendMeetingEmail }