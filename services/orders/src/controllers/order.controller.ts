import { NextFunction, Request, Response } from "express";
import { OrderModel } from "../models/order.model.js";
import { orderValidation } from "../helpers/validators/order.validator.js";
import { randomInt } from "crypto";
import { TotalOrderModel } from "../models/totalOrder.model.js";
import { getDataFromAnotherService } from "../helpers/utils/getDataFromAnotherService.js";
import { v4 as uuidv4 } from "uuid";
import { Products } from "../types/Products.js";
import { Types } from "mongoose";
import { ErrorHandler } from "../helpers/utils/errorHandlers.js";
import { io } from "../config/socketio.config.js";
import { createEventSecret } from "../helpers/utils/createEventSecret.js";

async function getAllOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const vendorStoreId = req.params.vendorStoreId;
    const { limit, pageSize } = req.query;

    const ORDER_LIMIT = Number(limit) || 10;
    const PAGE_SIZE = 1 * Number(pageSize || 1);
    const skip = (PAGE_SIZE - 1) * ORDER_LIMIT;

    if (!vendorStoreId || Types.ObjectId.isValid(vendorStoreId) === false) {
      throw new ErrorHandler(
        400,
        "please provide order id or invalid order id"
      );
    }

    const order = await OrderModel.find({
      vendorStoreId,
      "isOrderCompleted.isDelivered": false,
    })
      .select("-orderOTP")
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(ORDER_LIMIT);

    if (!order) {
      throw new ErrorHandler(404, "order not found");
    }

    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    const orderId = req.params.orderId;

    if (!orderId || Types.ObjectId.isValid(orderId) === false) {
      throw new ErrorHandler(
        400,
        "please provide order id or invalid order id"
      );
    }

    const order = await OrderModel.findById(orderId).select("-orderOTP");

    if (!order) {
      throw new ErrorHandler(404, "order not found");
    }

    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
}

async function getOrderByCustomerId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const customerId = req.params.customerId;

    if (!customerId || Types.ObjectId.isValid(customerId) === false) {
      throw new ErrorHandler(
        400,
        "please provide order id or invalid order id"
      );
    }

    const order = await OrderModel.find({ customerId });

    if (!order) {
      throw new ErrorHandler(404, "order not found");
    }

    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
}

async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = await orderValidation(req.body, "createOrder");
    const { vendorStoreId, orderItems, ...restData } = validatedData;
    const orderOTP = randomInt(1000, 9999).toString();

    const currentDate = new Date();
    const startOfCurrentDate = new Date(
      Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      )
    );

    const { currentOrderNumber } = await TotalOrderModel.findOneAndUpdate(
      {
        vendorStoreId,
        date: startOfCurrentDate.toString(),
      },
      { $inc: { totalOrders: 1, currentOrderNumber: 1 } },
      { upsert: true, new: true }
    );

    const quantities: { [key: string]: number } = {};
    const productId = orderItems.map(
      ({ productId, quantity }: { productId: string; quantity: number }) => {
        quantities[productId] = quantity;
        return { productId };
      }
    );
    const messageId = uuidv4();

    const { data } = await getDataFromAnotherService({
      messageId,
      event: "getMenuItems",
      message: {
        vendorStoreId,
        productId,
      },
      queueName: `${process.env.MENU_LISTING_QUEUE}`,
      replyToQueue: `${process.env.ORDER_REPLY_QUEUE}`,
    });

    let totalAmount = {
      currency: null || "",
      value: 0,
    };

    const product = data.menu.map((item: Products) => {
      const { _id, name, price } = item;
      const quantity = quantities[_id.toString()] || 0;
      const { value, currency } = totalAmount;

      if (!currency) {
        totalAmount.currency = price.currency;
      }

      totalAmount.value = price.value * quantity + value;

      return {
        productId: _id,
        name,
        price,
        quantity,
      };
    });

    const payload = {
      orderNumber: currentOrderNumber,
      totalAmount,
      orderItems: [...product],
      vendorStoreId,
      ...restData,
    };

    const newOrder = new OrderModel({ orderOTP, ...payload });
    await newOrder.save();
    const { orderStatus, paymentStatus, _id } = newOrder;

    const response = { _id, orderStatus, paymentStatus, ...payload };

    const secret = createEventSecret(vendorStoreId);
    io.emit(`new_order_${secret}`, { ...response });

    res.status(200).send({
      order: { orderOTP, ...response },
      message: "order created successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderStatus, orderId } = await orderValidation(
      req.body,
      "updateOrderStatus"
    );

    const order = await OrderModel.findById(orderId).select("-orderOTP");
    if (!order) {
      throw new ErrorHandler(404, "order not found");
    }
    order.orderStatus = orderStatus;
    await order.save();

    const eventSecret = createEventSecret(order.customerId.toString());
    io.emit(`order_status_${eventSecret}`, { orderStatus, orderId });

    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
}

async function completeOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { vendorStoreId, orderId, orderNumber, orderOTP } =
      await orderValidation(req.body, "completeOrder");

    const order = await OrderModel.findOne({ _id: orderId, vendorStoreId });

    if (!order) {
      throw new ErrorHandler(404, "order not found");
    }

    if (order.orderNumber !== orderNumber) {
      throw new ErrorHandler(400, "order number does not match");
    }

    if (order.paymentMode === "cash") {
      if (order.orderOTP !== orderOTP) {
        throw new ErrorHandler(400, "invalid OTP");
      }

      order.paymentStatus = "paid";
      order.isOrderCompleted.isDelivered = true;
      await order.save();
    }

    if (order.paymentMode === "online") {
      if (order.paymentStatus !== "paid") {
        throw new ErrorHandler(400, "payment is not completed");
      }
    }

    res.status(200).send({ message: "order delivered" });
  } catch (error) {
    next(error);
  }
}

async function forgetOrderOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { customerMobileNumber, vendorStoreId } = await orderValidation(
      req.body,
      "forgetOrderOTP"
    );
    const order = await OrderModel.findOne({
      vendorStoreId,
      customerMobileNumber: {
        $regex: new RegExp(`\\d{0,4}${customerMobileNumber}$`),
      },
    });

    if (!order) {
      throw new ErrorHandler(404, "order not found");
    }

    if (order.paymentMode === "cash") {
      order.paymentStatus = "paid";
      order.isOrderCompleted = {
        isDelivered: true,
        isDeliveredByFallback: true,
      };

      await order.save();
    }

    if (order.paymentMode === "online") {
      if (order.paymentStatus !== "paid") {
        throw new ErrorHandler(400, "payment is not completed");
      }
    }

    res.status(200).send({ message: "order delivered" });
  } catch (error) {
    next(error);
  }
}

export {
  getAllOrders,
  getOrderById,
  getOrderByCustomerId,
  createOrder,
  updateOrderStatus,
  completeOrder,
  forgetOrderOTP,
};
