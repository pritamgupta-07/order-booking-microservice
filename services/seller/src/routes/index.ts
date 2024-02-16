import express from "express";
import sellerRoutes from "./seller.route.js";

const handleRoutes = express();

handleRoutes.use("/", sellerRoutes)
// handleRoutes.use(usersRoutes)

export default handleRoutes;