import express from "express";
import updateProductStatus from "../../controllers/product/statusUpdateProductController";

const updateProductStatusRouter = express.Router();

updateProductStatusRouter.route("/update-product-status/:productId").patch(updateProductStatus)

export default updateProductStatusRouter