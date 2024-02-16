import mongoose, { Schema, model, Types } from "mongoose";

const sellerSchema = new mongoose.Schema<Seller>({
  name: {
    type: String,
    required: true,
  },
  category:{
    type: String,
    enum: ["restaurant", "bakery", "sweet shop", "stall"],
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  location: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    place: { type: String, required: true },
    landmark: { type: String, required: false },
  },
  isPureVeg: {
    type: Boolean,
    required: true,
    default: false
  },
  foodType: {
    type: [{ type: String }],
    required: true,
  },
  isSponsored: {
    type: Boolean,
    required: false,
    default: false
  },
  logoUrl: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
  },
  openingHour: {
    type: String,
    required: true,
  },
  contact: {
    mobile: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: false,
    }
  },
  facilities: {
    type: [{ type: String }],
  },
  restaurantPhotos: {
    type: [{ type: String }],
  },
  menuPhotos: {
    type: [{ type: String }],
  },
});

export const SellerModel = model<Seller>(
  "seller",
  sellerSchema
);

// type interface for shcema

interface Seller {
  name: string;
  category: string;
  ownerId: Types.ObjectId;
  description: string;
  location: {
    state: string;
    city: string;
    place: string;
    landmark: string;
  };
  isPureVeg: boolean;
  foodType: string[];
  isSponsored: boolean;
  logoUrl: string;
  websiteUrl: string;
  openingHour: string;
  contact: {mobile: number, email: string};
  facilities: string[];
  restaurantPhotos: string[];
  menuPhotos: string[];
}
