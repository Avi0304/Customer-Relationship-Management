const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", require("./routes/Auth"));
app.use("/api/Customer", require("./routes/Customer"));
app.use("/api/Appointment", require("./routes/AppointmentRoute"));
app.use("/api/tasks", require("./routes/Task"));
app.use("/api/sales", require("./routes/Sales"));
app.use("/api/Dashboard", require('./routes/DashBoardStatsRoute'));

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(); // Ensures database connection is established
    console.log("✅ Database Connected Successfully".bgMagenta);

    app.listen(PORT, () => {
      console.log(`🚀 Server is Running on ${PORT}`.bgCyan);
    });
  } catch (error) {
    console.error("❌ Error Starting Server:", error.message.red);
    process.exit(1);
  }
};

startServer();
