import mongoose, { Schema, model, Types } from "mongoose";

const orderSchema = new mongoose.Schema<Order>({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  vendorStoreId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerMobileNumber: {
    type: String,
    required: true,
  },
  orderItems: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        value: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          enum: ["inr", "usd"],
          required: true,
        },
      },
    },
  ],
  totalAmount: {
    value: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["inr", "usd"],
      required: true,
    },
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "delivered"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  paymentMode: {
    type: String,
    enum: ["cash", "online"],
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderNumber: {
    type: Number,
    required: true,
    default: 1,
  },
  orderOTP: {
    type: String,
    required: true,
  },
  isOrderCompleted: {
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isDeliveredByFallback: {
      type: Boolean,
      default: false,
    },
  },
});

export const OrderModel = model<Order>("order", orderSchema);
export const DeliveredOrderModel = model<Order>("delivered-order", orderSchema);

// type interface for shcema

export interface Order {
  customerId: Types.ObjectId;
  vendorStoreId: Types.ObjectId;
  customerName: string;
  customerMobileNumber: string;
  orderItems: OrderItem[];
  totalAmount: {
    currency: Currency;
    value: number;
  };
  orderStatus: OrderStatus | "pending";
  paymentStatus: "paid" | "failed" | "pending";
  paymentMode: "cash" | "online";
  orderDate: Date;
  orderNumber: number;
  orderOTP: string;
  isOrderCompleted: {
    isDelivered: boolean;
    isDeliveredByFallback: boolean;
  };
}

interface OrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: {
    currency: Currency;
    value: number;
  };
}

enum OrderStatus {
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  DELIVERED = "delivered",
}

enum Currency {
  INR = "inr",
  USD = "usd",
}
