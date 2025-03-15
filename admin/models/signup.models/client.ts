import { Schema } from "mongoose";
import mongoose from "mongoose";

const registerClient = new Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    number: { 
        type: String, 
        required: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6 
    },
    otp:{
        type:String,
        default:""
    }
},{
    timestamps: true
});


const Client = mongoose.model("Client",registerClient);

export default Client