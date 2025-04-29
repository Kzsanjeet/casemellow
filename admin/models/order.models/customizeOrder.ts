import { Schema } from "mongoose";
import mongoose from "mongoose";

const customizeOrderSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true, 
    },
    customize:{
        type: Schema.Types.ObjectId,
        ref: "Customize",
    },
    croppedImage:{
        type: String,
    },
    number:{
      type: Number,
      required: true,
    },
    pickUpAddress: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
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
      enum: ["pending", "picked up", "sent for delivery", "delivered"],
      default: "pending",
    },
    paymentMethod:{
      type: String,
      enum: ["Khalti", "COD"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancel"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    trackOrderId :{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

const CustomizeOrder = mongoose.model("CustomizeOrder", customizeOrderSchema);

export default CustomizeOrder;
