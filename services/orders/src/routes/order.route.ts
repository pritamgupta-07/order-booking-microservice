import express, { Router } from "express";
import { completeOrder, createOrder, forgetOrderOTP, getAllOrders, getOrderByCustomerId, getOrderById, updateOrderStatus } from "../controllers/index.js";

const orderRouter: Router = express.Router();

orderRouter.get("/:orderId", getOrderById);
orderRouter.get("/get-all/:vendorStoreId", getAllOrders);
orderRouter.get("/customer/:customerId", getOrderByCustomerId);

orderRouter.post("/create", createOrder);
orderRouter.post("/deliver-order", completeOrder);
orderRouter.post("/fallback-delivery", forgetOrderOTP);

orderRouter.put("/update-order-status", updateOrderStatus);


export default orderRouter;
