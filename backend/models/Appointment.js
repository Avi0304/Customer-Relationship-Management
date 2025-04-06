const { duration } = require('@mui/material');
const mongoose  = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    },
    customer: {
        type: String,
        require: true
    },
    contact: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
      },      
    date: {
        type: Date,
        require: true
    },
    time:{
        type: String,
        require: true
    },
    duration: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
},{timestamps: true})

const Appointment = mongoose.model("Appointment",AppointmentSchema);
module.exports = Appointment;