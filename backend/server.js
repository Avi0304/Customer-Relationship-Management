const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const path = require("path");
require("colors"); // <== Add this for colored logs

const { initializeSocket } = require("./socket");

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
app.use("/api/Dashboard", require("./routes/DashBoardStatsRoute"));
app.use("/api/Profile", require("./routes/ProfileRoute"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/data", require("./routes/Data"));
app.use("/api/leads", require("./routes/Leads"));
app.use("/api/Contact", require("./routes/contactRoute"));
app.use("/api/notifications", require("./routes/notificationRoute"));
app.use("/api/support", require("./routes/Support"));
app.use("/api/campaign", require("./routes/Campaign"));
app.use("/api/email-campaigns", require("./routes/emailCampaignRoutes"));

if (!process.env.PORT) {
  console.error("❌ Missing environment variables. Check .env file.".red.bold);
  process.exit(1);
}

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is Running on Port ${PORT}`.bgCyan.white.bold);
});

// Initialize Socket.IO
initializeSocket(server);

const startServer = async () => {
  try {
    console.log("🔁 Connecting to MongoDB...".yellow);

    await connectDB();
    console.log("✅ Database Connected Successfully".bgMagenta.white.bold);

    // Load Agenda jobs
    require("./agendaService");
  } catch (error) {
    console.error("❌ Error Starting Server:".red, error.message.red.bold);
    process.exit(1);
  }
};

startServer();
