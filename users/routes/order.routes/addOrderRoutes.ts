import express from "express";
import {addOrder, khalti, verifyKhalti} from "../../controllers/order/addOrderController";
import getUserOrder from "../../controllers/order/getOrderdata.controller";
// import authenticate from "../../../middleware/tokenAuth";

const addOrderRouter = express.Router();
const khaltiRouter = express.Router();
const getUserOrderRouter = express.Router();

// addOrderRouter.route("/order/add-order").post(authenticate,addOrder)
addOrderRouter.route("/order/add-order").post(addOrder)
khaltiRouter.route("/khalti/initiate").post(khalti)
khaltiRouter.route("/khalti/verify").post(verifyKhalti)

//get user order
getUserOrderRouter.route("order/get").get(getUserOrder)


export {addOrderRouter,khaltiRouter, getUserOrderRouter}