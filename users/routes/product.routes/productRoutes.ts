import express from "express";
import multer from "multer";
import addProduct from "../../controllers/product/productController";
import { Express } from "express";

const productRouter = express.Router();

interface MulterRequest extends Request{
    file?: Express.Multer.File
}

const upload = multer({ storage: multer.diskStorage({}) });

productRouter.post("/add-products",upload.single("productImage"),addProduct);

export default productRouter;
