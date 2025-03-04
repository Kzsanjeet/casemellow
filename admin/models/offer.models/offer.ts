import { Schema } from "mongoose";
import mongoose from "mongoose";

const offerSchema = new Schema(
    {
    title:{
        type:String,
        required:true
    },
     promoCode :{type:String, required:true},
     discount:{
        type:Number,
        required:true,
     },
     expiry:{
        type:Date,
        required:true
     },
     isActive:{
        type:Boolean,
        default:true
     }
    },
    {
        timestamps: true, 
    }
);

const Offer = mongoose.model("Offer",offerSchema)

export default Offer