import express from "express";
import multer from "multer";
import { addCustomizeOrder, customizekhalti, customizeVerifyKhalti } from "../../controllers/customizeOrder/addCustomizeOrder.controller";

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

export { addCustomizeOrderRouter };
