import express from "express";
import addToCart from "../../controllers/cart/addCartController";
import authenticate from "../../../middleware/tokenAuth";

const addToCartRouter = express.Router();

// Ensure authentication happens before calling addToCart
addToCartRouter.post("/cart/add-cart", authenticate, addToCart);

export default addToCartRouter;
