import express from "express";
import getAllUserCart from "../../controllers/cart/getAllCartController";

const getAllUserCartRouter = express.Router();

getAllUserCartRouter.route("/cart/get/:clientId").get(getAllUserCart)

export default getAllUserCartRouter 