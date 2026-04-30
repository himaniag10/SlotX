const express = require("express");
const corsMiddleware = require("./configs/cors");
const authRouter = require("./routes/auth.routes");
const adminRouter = require("./routes/admin.routes");
const bookingRouter = require("./routes/booking.routes");
const connectDB = require("./configs/db");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error.middleware");

// ✅ ADD THESE
const session = require("express-session");
const passport = require("./configs/passport");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

// ✅ ADD THESE (BEFORE ROUTES)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

// ─── Routes ─────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api", bookingRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`DEBUG: NODE_ENV = ${process.env.NODE_ENV}`);
      console.log(`Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
      console.log(`Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();