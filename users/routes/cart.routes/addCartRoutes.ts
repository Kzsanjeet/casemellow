import express from "express";
import addToCart from "../../controllers/cart/addCartController";

const addToCartRouter = express.Router();

addToCartRouter.route("/cart/add-cart").post(addToCart)

export default addToCartRouter