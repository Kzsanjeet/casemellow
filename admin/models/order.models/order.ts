import { Schema } from "mongoose";
import mongoose from "mongoose";

const orderSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true, 
    },
    productId: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    cartId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
    number:{
      type: Number,
      required: true,
    },
    // pickUpAddress: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
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

const Order = mongoose.model("Order", orderSchema);

export default Order;
