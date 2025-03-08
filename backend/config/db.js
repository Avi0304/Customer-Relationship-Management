const mongoose = require("mongoose");
const dotenv = require("dotenv");
require('colors');

dotenv.config();

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected ${conn.connection.host}`.bgYellow );
    } catch (error) {
        console.error(`Error in connecting MongoDB: ${error.message}`.bgRed);
        process.exit(1);
    }
};

module.exports = connectDB;