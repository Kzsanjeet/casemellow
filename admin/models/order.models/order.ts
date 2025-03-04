import { Schema } from "mongoose";
import mongoose from "mongoose";

const orderSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true, 
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true, 
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneModel: {
      type: String,
      required: true,
      trim: true,
    },
    coverType: {
      type: String,
      required: true,
      trim: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "canceled", "returned"], 
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"], 
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
