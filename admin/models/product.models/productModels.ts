// import { Schema } from "mongoose";
// import mongoose from "mongoose";

// const productSchema = new Schema(
//   {
//     productName: { type: String, required: true },
//     brands: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }, // Reference to Brand
//     phoneModel: { type: String, required: true },
//     coverType: {
//       type: [String],
//       required: true,
//     },
//     productDescription: { type: String, required: true },
//     productPrice: {
//       type: Number,
//       required: true,
//       min: [0, "Product price must be a positive number"],
//     },
//     productImage: {
//       type: String,
//     },
//     productCategory: { type: String, required: true },
//     isActive: { type: Boolean, default: true }, // Renamed for consistency
//   },
//   { timestamps: true } // Add timestamps for createdAt and updatedAt
// );

// const Product = mongoose.model("Product", productSchema);

// export default Product;

import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    brands: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }, // Reference to Brand
    phoneModel: { type: String, required: true },
    coverType: {
      type: [String],
      required: true,
    },
    productDescription: { type: String, required: true },
    productPrice: {
      type: Number,
      required: true,
      min: [0, "Product price must be a positive number"],
    },
    productImage: {
      type: String,
    },
    productCategory: { type: String, required: true },
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

