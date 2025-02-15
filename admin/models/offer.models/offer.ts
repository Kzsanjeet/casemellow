import { Schema } from "mongoose";
import mongoose from "mongoose";

const offerSchema = new Schema(
    {
        productName: { type: String, required: true },
        productDescription: { type: String, required: true },
        productPrice: { type: Number, required: true, min: 0 },
        discountPercentage: { type: Number, required: true, min: 0, max: 100 },
        priceAfterDiscount: { type: Number},
        productImage: { type: String, required: true },
        productCategory: { type: String, required: true },
        brands: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    },
    {
        timestamps: true, 
    }
);

const Offer = mongoose.model("Offer",offerSchema)

export default Offer