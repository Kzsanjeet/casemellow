import express, { Request, Response, urlencoded} from "express";
import dotenv from "dotenv";
import cors from "cors"

import connectDb from "./dbConnect";
import registerRouter from "./users/routes/user.routes/registerRoute";
import loginRouter from "./users/routes/user.routes/loginRoute";
import brandRouter from "./users/routes/brand.routes/brandRoute";
import productRouter from "./users/routes/product.routes/productRoutes";
import offerRouter from "./users/routes/offer.routes/offerRoute";
import getAllBrandRouter from "./users/routes/brand.routes/getAllBrandRoute";
import editBrandRouter from "./users/routes/brand.routes/editSpecificBrandRoute";
import getSpecificBrandRouter from "./users/routes/brand.routes/getSpecificBrandRoute";

dotenv.config()
const app =  express()
const port = process.env.PORT || 4000;
connectDb()

app.get("/",(req:Request, res:Response)=>{
    res.send("Hello World");
})

app.use(express.json())
app.use(cors(
    {
        origin: ["http://localhost:3000"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
))
app.use(urlencoded({extended:true}))

// routes
app.use("/api/v1",
    registerRouter,
    loginRouter,
    brandRouter,
    productRouter,
    offerRouter,
    getAllBrandRouter,
    editBrandRouter,
    getSpecificBrandRouter
)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
 