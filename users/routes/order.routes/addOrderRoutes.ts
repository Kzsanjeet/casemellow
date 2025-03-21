import express from "express";
import {addOrder, khalti, verifyKhalti} from "../../controllers/order/addOrderController";
// import authenticate from "../../../middleware/tokenAuth";

const addOrderRouter = express.Router();
const khaltiRouter = express.Router();

// addOrderRouter.route("/order/add-order").post(authenticate,addOrder)
addOrderRouter.route("/order/add-order").post(addOrder)
khaltiRouter.route("/khalti/initiate").post(khalti)
khaltiRouter.route("/khalti/verify").post(verifyKhalti)

export {addOrderRouter,khaltiRouter}