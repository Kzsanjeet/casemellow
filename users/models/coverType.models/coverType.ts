import { Schema } from "mongoose";
import mongoose from "mongoose";

const addCoverType = new Schema({
        coverType: {type:String, required: true}
})

const CoverType = mongoose.model("CoverType", addCoverType);

export default CoverType;