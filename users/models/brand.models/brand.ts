import { Schema } from "mongoose";
import mongoose from "mongoose";

const addBrand = new Schema({
    brandName: { type: String, required: true },
    brandLogo: { type: String}
})

const Brand = mongoose.model("Brand", addBrand);

export default Brand;