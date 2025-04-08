const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const path = require("path");

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", require("./routes/Auth"));
app.use("/api/Customer", require("./routes/Customer"));
app.use("/api/Appointment", require("./routes/AppointmentRoute"));
app.use("/api/tasks", require("./routes/Task"));
app.use("/api/sales", require("./routes/Sales"));
app.use("/api/Dashboard", require("./routes/DashBoardStatsRoute"));
app.use("/api/Profile", require("./routes/ProfileRoute"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/data", require("./routes/Data"));
app.use("/api/leads", require("./routes/Leads"));
app.use("/api/Contact", require("./routes/contactRoute"));
app.use("/api/support", require("./routes/Support"));

if (!process.env.PORT) {
  console.error("Missing environment variables. Check .env file.");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();
    console.log("Database Connected Successfully".bgMagenta);

    app.listen(PORT, () => {
      console.log(`Server is Running on ${PORT}`.bgCyan);
    });
  } catch (error) {
    console.error("Error Starting Server:", error.message.red);
    process.exit(1);
  }
};

startServer();
