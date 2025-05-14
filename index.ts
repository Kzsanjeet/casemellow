import express, { Request, Response, urlencoded} from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";

import connectDb from "./dbConnect";
import registerRouter from "./admin/routes/user.routes/registerRoute";
import loginRouter from "./admin/routes/user.routes/loginRoute";
import brandRouter from "./admin/routes/brand.routes/brandRoute";
import offerRouter from "./admin/routes/offer.routes/offerRoute";
import getAllBrandRouter from "./admin/routes/brand.routes/getAllBrandRoute";
import editBrandRouter from "./admin/routes/brand.routes/editSpecificBrandRoute";
import getSpecificBrandRouter from "./admin/routes/brand.routes/getSpecificBrandRoute";
import productRouter from "./admin/routes/product.routes/productRoutes";
import editSpecificProductRouter from "./admin/routes/product.routes/editProductRoutes";
import getAllProductRouter from "./admin/routes/product.routes/getAllProductRoutes";
import deleteBrandRouter from "./admin/routes/brand.routes/deleteBrandRoute";
import getSpecificProductRouter from "./admin/routes/product.routes/getSpecificProductRoutes";
import updateProductStatusRouter from "./admin/routes/product.routes/updateProductStatusRoute";
import deleteProductRouter from "./admin/routes/product.routes/deleteProductRoutes";
import getPopularProductRouter from "./users/routes/product.routes/getPopularProductRoutes";
import getBestSellingProductRouter from "./users/routes/product.routes/getBestSellingProductRouter";
import getProductByCategoryRouter from "./users/routes/product.routes/getProductByCategoryRoutes";
import getSingleProductRouter from "./users/routes/product.routes/getSpecificProductRoutes";
import getPhoneModelByBrandRouter from "./users/routes/product.routes/getPhoneModelsRoutes";
import getSimilarProductRouter from "./users/routes/product.routes/getSimilarProductRoutes";
import getAllProductRouterForClient from "./users/routes/product.routes/getAllProductRoutes";
import {addOrderRouter, getUserOrderRouter, khaltiRouter} from "./users/routes/order.routes/addOrderRoutes";
import addToCartRouter from "./users/routes/cart.routes/addCartRoutes";
import updateCartRouter from "./users/routes/cart.routes/updateCartRoutes";
import deleteCartRouter from "./users/routes/cart.routes/deleteCartRoutes";
import getAllUserCartRouter from "./users/routes/cart.routes/getAllUserCartRoutes";
import registerClientRouter from "./users/routes/register.routes/signupRoutes";
import loginClientRouter from "./users/routes/register.routes/loginRoutes";
import clientDataRouter from "./users/routes/register.routes/getUserDataRoutes";
import { customizeRouter } from "./admin/routes/customize.routes/customizeRoutes";
import addCustomizeOrderRouter from "./users/routes/order.routes/customizeOrder.routes";
import forgotPasswordRouter from "./users/routes/forgot-password.routes/forgot-passwordRoutes";
import adminForgotPasswordRouter from "./admin/routes/forgot.routes/forgot-route";

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
        origin: ["http://localhost:3000","https://casemellow.vercel.app"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
))
app.use(urlencoded({extended:true}))
app.use(cookieParser()) 

// routes
app.use("/api/v1",
    registerRouter,
    loginRouter,


    //offer
    offerRouter,

//brandRouter
    brandRouter,
    getAllBrandRouter,
    editBrandRouter,
    getSpecificBrandRouter,
    deleteBrandRouter,

//product router
    productRouter,
    editSpecificProductRouter,
    getAllProductRouter,
    getSpecificProductRouter,
    updateProductStatusRouter,
    deleteProductRouter,


    //for client

    // for client registration
    registerClientRouter,
    loginClientRouter,
    clientDataRouter,

    //for product router
    getPopularProductRouter,
    getBestSellingProductRouter,
    getProductByCategoryRouter,
    getSingleProductRouter,
    getPhoneModelByBrandRouter,
    getSimilarProductRouter,
    getAllProductRouterForClient,

    //for order
    addOrderRouter,
    getUserOrderRouter,

    //for cart
    addToCartRouter,
    updateCartRouter,
    deleteCartRouter,
    getAllUserCartRouter,

    //khalti
    khaltiRouter,

    //customize
    customizeRouter,
    addCustomizeOrderRouter,

    //forgot-password
    forgotPasswordRouter,
    adminForgotPasswordRouter
)


app.listen(port, () => {    
    console.log(`Server is running on port ${port}`)
});
 