import express from "express";
import getSpecificProduct from "../../controllers/product/getSpecificProductController";

const getSingleProductRouter = express.Router();

getSingleProductRouter.route("/products/get/:productId").get(getSpecificProduct);

export default getSingleProductRouter;