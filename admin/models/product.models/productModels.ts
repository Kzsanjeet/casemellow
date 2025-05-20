import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema(
  {
    productName: { type: String },
    brands: { type: mongoose.Schema.Types.ObjectId, ref: "Brand"}, // Reference to Brand
    phoneModel: { type: String },
    coverType: {
      type: [String],
      required: true,
    },
    productDescription: { type: String},
    productPrice: {
      type: Number,
      required: true,
      min: [0, "Product price must be a positive number"],
    },
    discount:{type:Number, default:0},
    productImage: {
      type: String,
    },
    productCategory: { type: String},
    isActive: { type: Boolean, default: true }, // Renamed for consistency,
    productView :{type:Number, default:0},
    ordersNumber: {type:Number, default:0},
    isCart:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true } // Add timestamps for createdAt and updatedAt
);

const Product = mongoose.model("Product", productSchema);

export default Product;

