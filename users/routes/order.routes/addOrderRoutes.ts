import express from "express";
import {addOrder, khalti, verifyKhalti} from "../../controllers/order/addOrderController";
import getUserOrder from "../../controllers/order/getOrderdata.controller";
import getAllOrders from "../../controllers/order/getAllOrderController";
import codOrder from "../../controllers/order/codOrderController";
import updatePaymentStatus from "../../controllers/order/updatePaymentStatusController";
import {editOrderStatus, editPaymentStatus} from "../../controllers/order/editPaymentStatusController";
import deleteOrder from "../../controllers/order/deleteOrderController";
import getOrderStatus from "../../controllers/order/getOrderStatus";
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

//update status
getUserOrderRouter.route("/order/update-status/:orderId").patch(updatePaymentStatus)


//editPayment status
getUserOrderRouter.route("/order/payment/update-status").patch(editPaymentStatus)
getUserOrderRouter.route("/order/order/update-status").patch(editOrderStatus)

getUserOrderRouter.route("/order/delete/:orderId").delete(deleteOrder)

// to get orderStatus
getUserOrderRouter.route("/order/get-status").post(getOrderStatus);

export {addOrderRouter,khaltiRouter, getUserOrderRouter}