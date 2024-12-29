import { Schema } from "mongoose";
import mongoose from "mongoose";

const addBrand = new Schema({
    brandName: { type: String, required: true },
    phoneModel:{type:String, requied:true,
        coverType:{type:mongoose.Schema.Types.ObjectId, ref:"CoverType"}
    },
    
})

const Brand = mongoose.model("Brand", addBrand);

export default Brand;