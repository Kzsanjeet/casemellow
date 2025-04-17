import express from "express";
import multer from "multer";
import { addCustomizeOrder, customizeCodOrder, customizekhalti, customizeVerifyKhalti, updateCustomizePaymentStatus} from "../../controllers/customizeOrder/addCustomizeOrder.controller";


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

addCustomizeOrderRouter.route("/order/customize/update-status/:orderId").patch(updateCustomizePaymentStatus);

export { addCustomizeOrderRouter };
