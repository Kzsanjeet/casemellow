import express from "express";
import addOrder from "../../controllers/order/addOrderController";

const addOrderRouter = express.Router();

addOrderRouter.route("/order/add-order").post(addOrder)

export default addOrderRouter