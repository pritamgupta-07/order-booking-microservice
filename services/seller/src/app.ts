import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import connectDB from "./config/db/mongodb.config.js";
import handleRoute from "./routes/index.js";
import cors from "cors";
import { handleRequestLog, handleError } from "./middleware/index.js";

//connect database
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use(handleRequestLog);

// handling routes
app.use("/api/v1/seller", handleRoute);

// error handler
app.use(handleError);

export default app;
