import express from "express";
import multer from "multer";
import { addCustomizeOrder, customizeCodOrder, customizekhalti, customizeVerifyKhalti, deleteCustomizeOrder, editCustomizeOrderStatus, editCustomizePaymentStatus, getAllCustomizeOrders, updateCustomizePaymentStatus} from "../../controllers/customizeOrder/addCustomizeOrder.controller";


const addCustomizeOrderRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/customize-Order");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

addCustomizeOrderRouter.post(
  "/order/customize/add-order",
  upload.fields([{ name: "croppedImage", maxCount: 1 }]),
  addCustomizeOrder
);

addCustomizeOrderRouter
  .route("/khalti/customize/initiate")
  .post(customizekhalti);

addCustomizeOrderRouter
  .route("/khalti/customize/verify")
  .post(customizeVerifyKhalti);

addCustomizeOrderRouter.post(
  "/order/customize/cod/add-order",
  upload.fields([{ name: "croppedImage", maxCount: 1 }]),
  customizeCodOrder
);

addCustomizeOrderRouter.route("/order/customize/update-status/:customizeOrderId").patch(updateCustomizePaymentStatus);

addCustomizeOrderRouter.route("/order/customize/get").get(getAllCustomizeOrders)

//for admin
addCustomizeOrderRouter.route("/order/customize/payment/edit").patch(editCustomizePaymentStatus);
addCustomizeOrderRouter.route("/order/customize/edit").patch(editCustomizeOrderStatus);
addCustomizeOrderRouter.route("/order/customize/delete/:customizeOrderId").delete(deleteCustomizeOrder);

export default addCustomizeOrderRouter;