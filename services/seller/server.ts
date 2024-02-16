import logger from "./src/logger/index.js";
import app from './src/app.js';
import * as dotenv from 'dotenv'

dotenv.config();

const HOST = 'localhost';
const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    logger.info(`Seller Server Started on ${HOST}:${PORT}`);
})