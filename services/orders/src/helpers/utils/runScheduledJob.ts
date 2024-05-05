import schedule from "node-schedule";
import logger from "../../logger/index.js";
import { DeliveredOrderModel, OrderModel } from "../../models/order.model.js";

export const runScheduledJob = () => {
  //  run the job at 12:00 AM every day
  schedule.scheduleJob("0 0 * * *", async function () {
    try {
      const orders = await OrderModel.find({
        "isOrderCompleted.isDelivered": true,
      });
      const delivered = await DeliveredOrderModel.insertMany(orders);

      if (delivered) {
        logger.info("orders moved to delivered orders collection");
      }
    } catch (error) {
      logger.error(error);
    }
  });
};
