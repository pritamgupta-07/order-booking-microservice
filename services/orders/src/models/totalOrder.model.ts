import { Types, Schema, model } from 'mongoose';

const schema = new Schema<TotalOrder>({
    currentOrderNumber: {
        type: Number,
        required: true,
    },
    totalOrders: {
        type: Number,
        required: true,
    },
    vendorStoreId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    totalAmount: {
        value: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export const TotalOrderModel = model<TotalOrder>('totalOrder', schema); 

interface TotalOrder {
    currentOrderNumber: number;
    totalOrders: number;
    vendorStoreId: Types.ObjectId;
    totalAmount: {
        value: number;
        currency: string;
    };
    date: Date;
}