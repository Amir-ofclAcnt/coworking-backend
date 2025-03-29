const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes"); // om du har den
const http = require("http");
const socketio = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "https://coworking-frontend-weld.vercel.app", // <- din Vercel-URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// CORS-inställningar
const corsOptions = {
  origin: "https://coworking-frontend-weld.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // <- hantera preflight

// Middleware
app.use(express.json());

// API-routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes); // om du har den

// MongoDB-anslutning
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Ansluten till MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// WebSocket
io.on("connection", (socket) => {
  console.log("🔌 Användare ansluten");
  socket.on("disconnect", () => {
    console.log("🔌 Användare frånkopplad");
  });
});

app.set("io", io);

// Starta server
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`🚀 Server körs på port ${PORT}`);
});
