import { Schema } from "mongoose";
import mongoose from "mongoose";

const cartSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true, 
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
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
    quantity:{
      type:Number,
      required:true
    },
    cartDate: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
