import mongoose from "mongoose";
import logger from "../../logger/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);

    logger.info("Database Connected");
  } catch (error) {
    logger.error(error);
  }
};

export default connectDB;
