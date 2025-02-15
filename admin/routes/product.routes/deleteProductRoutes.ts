import express from "express";
import deleteProduct from "../../controllers/product/deleteProductController";

const deleteProductRouter = express.Router();

deleteProductRouter.route("/products/delete/:productId").delete(deleteProduct);

export default deleteProductRouter

///delete product router