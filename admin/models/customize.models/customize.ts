import { Schema } from "mongoose";
import mongoose from "mongoose";

const customizeSchema = new Schema(
  {
    brands: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }, // Reference to Brand
    phoneModel: { type: String, required: true },
    coverType: {
      type: String,
      required: true,
    },
    coverPrice: {
      type: Number,
      required: true,
      min: [0, "Product price must be a positive number"],
    },
    mockUpImage: {
      type: String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // Add timestamps for createdAt and updatedAt
);

const Customize = mongoose.model("Customize", customizeSchema);

export default Customize;
