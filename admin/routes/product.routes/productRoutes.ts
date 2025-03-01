// import express from "express";
// import multer from "multer";

// import { Express } from "express";
// import addProduct from "../../controllers/product/productController";

// const productRouter = express.Router();

// interface MulterRequest extends Request{
//     file?: Express.Multer.File
// }

// const upload = multer({ storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/products')
//         },
//         filename: (req, file, cb) => {
//             cb(null, file.originalname)
//         }
// }) });

// productRouter.post("/products/add-product",upload.single("productImage"),addProduct);

// export default productRouter;


import express from "express";
import multer from "multer";
import addProduct from "../../controllers/product/productController";

const productRouter = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products"); // Store images in 'uploads/products'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to avoid filename conflicts
  },
});

const upload = multer({ storage });

// Handle multiple file uploads
productRouter.post(
  "/products/add-product",
  upload.fields([
    { name: "productImage", maxCount: 1 }, // Single product image
    // { name: "categoryImage", maxCount: 1 }, // Single category image
  ]),
  addProduct
);

export default productRouter;

