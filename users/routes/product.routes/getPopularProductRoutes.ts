import express from "express";
import getPopularProduct from "../../controllers/product/getPopularProductController";

const getPopularProductRouter = express.Router();

getPopularProductRouter.route("/products/get-popular").get(getPopularProduct)


export default getPopularProductRouter;