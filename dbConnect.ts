import mongoose from "mongoose";

const connectDb = () =>{
    mongoose.connect(process.env.CONNECT_URI as string)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
}

export default connectDb