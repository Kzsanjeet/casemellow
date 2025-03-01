import express from "express";
import getBestSellingProduct from "../../controllers/product/getBestSellingProductController";


const getBestSellingProductRouter = express.Router();

getBestSellingProductRouter.route("/products/get-best-selling").get(getBestSellingProduct)

export default getBestSellingProductRouter;