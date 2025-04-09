import express from "express";
import addCustomize from "../../controllers/customize/addCustomize.controller";
import multer from "multer";
import getAllCustomize from "../../controllers/customize/getAll.controller";
import getSpecificCustomize from "../../controllers/customize/getSpecific.controller";
import editCustomize from "../../controllers/customize/editCustomize.controller";
import deleteCustomize from "../../controllers/customize/deleteCustomize.controller";
const customizeRouter = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/customize"); // Store images in 'uploads/products'
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to avoid filename conflicts
    },
  });
  
  const upload = multer({ storage });
  
  // Handle multiple file uploads
  customizeRouter.post(
    "/customize/add",
    upload.fields([
      { name: "productImage", maxCount: 1 }, // Single product image
      // { name: "categoryImage", maxCount: 1 }, // Single category image
    ]),
    addCustomize
  );

  customizeRouter.route("/customize/get-all").get(getAllCustomize);

  customizeRouter.route("/customize/get/:customizeId").get(getSpecificCustomize);

  customizeRouter.patch("/customize/edit/:customizeId",upload.fields([{name:"productImage",maxCount:1}]),editCustomize)

  customizeRouter.route("/customize/delete/:customizeId").delete(deleteCustomize);

export{customizeRouter}