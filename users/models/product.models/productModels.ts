import { Schema } from "mongoose";
import mongoose from "mongoose";

const addProduct = new Schema({
    productName: {type:String, required:true},
    brands: {type:Schema.Types.ObjectId,ref:"Brand"},
    productDescription: {type:String, required:true},
    productPrice: {type:Number, required:true},
    productImage: {type:String, required:true},
    productCategory: {type:String, required:true},
    phoneModel: { type: String, required: true },
    coverType: {
        type: [String], 
        required: true,
    },
})