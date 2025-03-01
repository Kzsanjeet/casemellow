import express from "express";
import getAllProductByCategory from "../../controllers/product/getProductsByCategoryController";

const getProductByCategoryRouter = express.Router();

getProductByCategoryRouter.route("/products/get-by-category/:category").get(getAllProductByCategory)

export default getProductByCategoryRouter; 