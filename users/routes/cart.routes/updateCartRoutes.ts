import express from "express";
import updateCart from "../../controllers/cart/updateCartController";


const updateCartRouter = express.Router();

updateCartRouter.route("/cart/update-cart/:cartId").patch(updateCart)

export default updateCartRouter