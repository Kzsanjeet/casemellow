import express from "express";
import {addOrder, khalti, verifyKhalti} from "../../controllers/order/addOrderController";
import getUserOrder from "../../controllers/order/getOrderdata.controller";
import getAllOrders from "../../controllers/order/getAllOrderController";
import codOrder from "../../controllers/order/codOrderController";
// import authenticate from "../../../middleware/tokenAuth";

const addOrderRouter = express.Router();
const khaltiRouter = express.Router();
const getUserOrderRouter = express.Router();

// addOrderRouter.route("/order/add-order").post(authenticate,addOrder)
addOrderRouter.route("/order/add-order").post(addOrder)
khaltiRouter.route("/khalti/initiate").post(khalti)
khaltiRouter.route("/khalti/verify").post(verifyKhalti)

//get user order
getUserOrderRouter.route("/order/get/:orderId").get(getUserOrder)
getUserOrderRouter.route("/order/get").get(getAllOrders)
getUserOrderRouter.route("/order/add-order/cod").post(codOrder)


export {addOrderRouter,khaltiRouter, getUserOrderRouter}