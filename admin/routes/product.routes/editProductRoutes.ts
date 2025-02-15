import express, { Request } from "express";
import multer from "multer";
import editSpecificProduct from "../../controllers/product/editSpecificProductController";

const editSpecificProductRouter = express.Router();

interface MulterRequest extends Request{
    file: Express.Multer.File;
}

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/products');
            },
            filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
})

editSpecificProductRouter.patch("/products/edit-product/:productId",upload.single("productImage"),editSpecificProduct)

export default editSpecificProductRouter    