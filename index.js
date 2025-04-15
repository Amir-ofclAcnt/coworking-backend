// 📦 Laddar miljövariabler
const dotenv = require("dotenv");
dotenv.config();

// 📦 Imports
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

// 🛠 Egna moduler
const { initSocket } = require("./sockets/notificationSocket"); // 🔌 Importera socket-init
const devRoutes = require("./routes/devRoutes");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const errorHandler = require("./middleware/errorHandler");
const responseWrapper = require("./middleware/responseWrapper");
const logger = require("./utils/logger");
const userRoutes = require("./routes/userRoutes");

// 🚀 Skapa Express-app & Server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Ändra detta för produktion
    credentials: true,
  },
});

// 🔌 Starta Socket.io-hantering
initSocket(io);
app.set("io", io); // Valfritt om du vill använda io via `req.app.get("io")`

// 🌐 CORS-inställningar
app.use(
  cors({
    origin: "http://localhost:5173", // Ändra vid deploy
    credentials: true,
  })
);

// 🧱 Middleware
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuter
    max: 100,
    message: "⛔ För många förfrågningar, försök igen om en stund.",
  })
);
app.use(responseWrapper);

// 🛣️ Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dev", devRoutes);
app.use("/api/users", userRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🌍 API is running...");
});

// ❤️ Health check (för deploy och load balancer)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

// 🛠 Felhantering
app.use(errorHandler);

// 🛢️ Anslut till MongoDB och starta servern
const PORT = process.env.PORT || 5002;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("✅ MongoDB connected");
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => logger.error("❌ MongoDB error:", err));
