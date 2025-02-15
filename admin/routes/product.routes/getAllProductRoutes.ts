import express from "express";
import getAllProduct from "../../controllers/product/getAllProductController";

const getAllProductRouter = express.Router()

getAllProductRouter.route("/products/get-all-product").get(getAllProduct);

export default getAllProductRouter;