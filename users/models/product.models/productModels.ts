import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema({
    productName: { type: String, required: true },
    brands: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }, // Reference to Brand
    productDescription: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productImage: { type: String },
    productCategory: { type: String, required: true },
    isActivate: {type:Boolean, default:false},
});


const Product = mongoose.model("Product", productSchema);

export default Product;
