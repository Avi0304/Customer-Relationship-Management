const Appointment = require('../models/Appointment');

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
const updateAppointment = async (req, res) => {
    try {
      const { time } = req.body;
  
      // Convert 24-hour format to 12-hour format with AM/PM if time is provided
      const convertTo12HourFormat = (time) => {
        if (!time) return null; // If no time is provided, return null
  
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
  
      // Update appointment
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
  
      res.status(200).json({
        message: "Appointment updated successfully",
        appointment: updatedAppointment,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating appointment", error });
    }
  };
  

// delete
const deleteAppointment = async(req,res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'Appointment Deleted Successfully...'}) 
    } catch (error) {
        res.status(500).json({message: 'Error in delete Appointment: ', error})
    }
}

// upcoming Appointment
const upcomingAppointment = async(req,res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const upcoming = await Appointment.find({date: {$gte: today}}).sort({date: 1});

        const formattedUpcoming = upcoming.map((appointment) => ({
            ...appointment._doc, // Spread existing data
            date: appointment.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD
          }));

        res.status(200).json({message: 'Upcoming Appointment: ', upcomingappointment: formattedUpcoming});
    } catch (error) {
        res.status(500).json({message: 'Error in fetching Upcoming Appointments: ', error})
    }
}

//past Appointment
const pastAppointment =async(req,res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const past = await Appointment.find({date: {$lt: today}}).sort({date: -1});

        const formattedPast = past.map((appointment) => ({
            ...appointment._doc, // Spread existing data
            date: appointment.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD
          }));

        res.status(200).json({message: 'Past Appointment: ', pastappointment: formattedPast});
    } catch (error) {
        res.status(500).json({message: 'Error in fetching the past appointment: ', error})
    }
}

module.exports = {getAllAppointment, addAppointment, updateAppointment, deleteAppointment, upcomingAppointment, pastAppointment}