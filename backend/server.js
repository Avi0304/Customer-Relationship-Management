const express = require('express')
const dontenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const morgan = require('morgan');


dontenv.config();
const app =express();

// Middlewares
app.use(cors())
app.use(express.json());
app.use(morgan('dev'))

// Connect to Database
connectDB();

// routes
app.use('/api/user', require('./routes/Auth'));
app.use('/api/Customer',require('./routes/Customer'));
app.use('/api/Appointment',require('./routes/AppointmentRoute'));

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Server is Running on ${PORT}`.bgCyan));