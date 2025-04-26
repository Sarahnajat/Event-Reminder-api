import express from "express";
import router from "./routes/eventRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rate-limit.js";
import userRouter from "./routes/userRoutes.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controller/errorController.js";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

// Load environment variables
dotenv.config({ path: "./config/.env" });

const app = express();
const PORT = process.env.PORT || 4000;
const DB = process.env.DB_CONNECTION;

// DB Connection
mongoose
  .connect(DB, {
    serverSelectionTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    maxPoolSize: 10,
  })
  .then((con) => {
    console.log("Database connected:", con.connections[0].host);
  });

// Set security HTTP headers
app.use(helmet());

//Rate limiting middleware
app.use(rateLimiter);

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

//  Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//  Prevent parameter pollution
app.use(hpp());

// Logging in dev
app.use(morgan("dev"));

// Add request timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mount routes
app.use("/api/v1/events", router);
app.use("/api/v1/users", userRouter);

//  Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
