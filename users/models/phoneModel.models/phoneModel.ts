import { Schema, model } from "mongoose";

const modelsSchema = new Schema({
    phoneModel: { type: String, required: true },
    coverTypes: {
        type: [String], // Array of strings
        enum: ["Premium 2 in 1", "3D slim", "2D cover"],
        required: true,
    },
});

const PhoneModel = model("Models", modelsSchema);

export default PhoneModel;
