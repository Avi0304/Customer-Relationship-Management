const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const path = require("path");
const http = require('http');
require("colors");

const { initializeSocket } = require("./socket");

dotenv.config();
const app = express();
const server = http.createServer(app); // ✅ Use this server for Socket.IO and listening

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
app.use("/api/messages", require("./routes/messageRoutes")); // ✅ Add message routes if not added

// Check for PORT
if (!process.env.PORT) {
  console.error("❌ Missing environment variables. Check .env file.".red.bold);
  process.exit(1);
}

const PORT = process.env.PORT || 8080;

// ✅ Initialize Socket.IO before listening
initializeSocket(server);

// ✅ Connect to MongoDB and Start Server
const startServer = async () => {
  try {
    console.log("🔁 Connecting to MongoDB...".yellow);
    await connectDB();
    console.log("✅ Database Connected Successfully".bgMagenta.white.bold);

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 Server is Running on Port ${PORT}`.bgCyan.white.bold);
    });

    // Load background jobs if any
    require("./agendaService");
  } catch (error) {
    console.error("❌ Error Starting Server:".red, error.message.red.bold);
    process.exit(1);
  }
};

startServer();
