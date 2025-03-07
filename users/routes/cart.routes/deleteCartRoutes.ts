import express from "express";
import deleteCart from "../../controllers/cart/deleteCartController";



const deleteCartRouter = express.Router();

deleteCartRouter.route("/cart/delete-cart/:cartId").delete(deleteCart)

export default deleteCartRouter