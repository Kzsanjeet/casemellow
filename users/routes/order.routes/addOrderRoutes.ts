import express from "express";
import addOrder from "../../controllers/order/addOrderController";
import authenticate from "../../../middleware/tokenAuth";

const addOrderRouter = express.Router();

addOrderRouter.route("/order/add-order").post(authenticate,addOrder)

export default addOrderRouter