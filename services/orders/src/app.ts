import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import connectDB from "./config/db/mongodb.config.js";
import handleRoute from "./routes/index.js";
import cors from "cors";
import { handleRequestLog, handleError } from "./middleware/index.js";
import { runScheduledJob } from "./helpers/utils/runScheduledJob.js";
import { checkEmptyBody } from "./middleware/checkEmptyBody.js";

//connect database
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use(handleRequestLog);
app.use(checkEmptyBody)

// execute the task at specific time
runScheduledJob();

// handling routes
app.use("/api/v1/order", handleRoute);

// error handler
app.use(handleError);

export default app;
