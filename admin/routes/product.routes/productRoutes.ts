import express from "express";
import multer from "multer";

import { Express } from "express";
import addProduct from "../../controllers/product/productController";

const productRouter = express.Router();

interface MulterRequest extends Request{
    file?: Express.Multer.File
}

const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products')
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
}) });

productRouter.post("/products/add-product",upload.single("productImage"),addProduct);

export default productRouter;
