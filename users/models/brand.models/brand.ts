import { Schema } from "mongoose";
import mongoose from "mongoose";

const addBrand = new Schema({
    brandName: { type: String, required: true },
    phoneModels: [
        {
            modelName: { type: String, required: true },
            coverTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: "CoverType" }],
        },
    ],
});

const Brand = mongoose.model("Brand", addBrand);

export default Brand;
