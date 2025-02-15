import express from "express";
import getSpecificProduct from "../../controllers/product/getSpecificProductController";

const getSpecificProductRouter = express.Router();

getSpecificProductRouter.route("/products/get/:productId").get(getSpecificProduct);

export default getSpecificProductRouter;

