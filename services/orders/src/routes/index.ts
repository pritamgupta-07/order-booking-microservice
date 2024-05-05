import express from "express";
import orderRoutes from "./order.route.js";

const handleRoutes = express();

handleRoutes.use("/", orderRoutes)

export default handleRoutes;