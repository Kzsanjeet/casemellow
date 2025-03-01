import { Schema } from "mongoose";
import mongoose from "mongoose";

const brandSchema = new Schema({
    brandName: { type: String, required: true , unique:true},
    isActive:{type:Boolean, default:true},
},
{
    timestamps: true,
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
