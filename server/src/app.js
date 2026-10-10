import express from "express";
import healthRouter from "../routes/health.route.js";
import userRouter from "../routes/user.route.js";
import ticketRouter from "../routes/ticket.route.js";
import departmentRouter from "../routes/department.route.js";
import errorHandler from "../middleware/error.middleware.js";
const app = express();

app.use(express.json());
app.use("/api/health", healthRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/department", departmentRouter);
app.use(errorHandler);
export default app;
