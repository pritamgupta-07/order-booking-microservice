import { Types } from "mongoose";

export interface Products {
    _id: Types.ObjectId;
    name: string;
    price: {
        value: number;
        currency: "inr" | "usd";
    };
}