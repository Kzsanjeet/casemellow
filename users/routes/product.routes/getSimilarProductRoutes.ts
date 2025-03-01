import express from "express";
import getSimilarProducts from "../../controllers/product/getSimilarProductControllet";

const getSimilarProductRouter = express.Router();

getSimilarProductRouter.route("/products/similar/:productId").get(getSimilarProducts)

export default getSimilarProductRouter