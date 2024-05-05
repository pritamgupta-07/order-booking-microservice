import logger from "./src/logger/index.js";
import app from "./src/app.js";
import * as dotenv from "dotenv";
import { createServer } from "http";
import { initializeSocket } from "./src/config/socketio.config.js";

dotenv.config();

const HOST = "localhost";
const PORT = process.env.PORT || 4100;


const server = createServer(app);

initializeSocket(server);


server.listen(PORT, () => {
  logger.info(`Order Server Started on ${HOST}:${PORT}`);
});
