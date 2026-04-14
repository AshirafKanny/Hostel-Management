import express from "express";
import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import path from "path";
import morgan from "morgan";

import dotenv from "dotenv";
import connectDB from "./config/mongoDBConfig.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
dotenv.config();
connectDB();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
