import { Request, Response } from "express";
import Product from "../../models/product.models/productModels";
import { uploadFile } from "../../../utility/cloudinary";

interface MulterRequest extends Request{
    file: Express.Multer.File
}

const addProduct = async (req: Request, res: Response): Promise<void> => {
    const MulterReq = req as MulterRequest;

    try {
        const {
            productName,
            brands, // Expecting the brand ID
            productDescription,
            productPrice,
            productCategory,
        } = MulterReq.body;

        if (
            !productName ||
            !brands ||
            !productDescription ||
            !productPrice ||
            !productCategory
        ) {
            res.status(404).json({ success: false, message: "Please fill all the fields" });
            return;
        }

        const productImage = MulterReq.file;
        if (!productImage) {
            res.status(404).json({ success: false, message: "Please upload a product image" });
            return;
        }

        const uploadedImage = await uploadFile(productImage.path, "products");

        const product = await Product.create({
            productName,
            brands, // Reference to the Brand ID
            productDescription,
            productPrice,
            productImage: uploadedImage?.secure_url,
            productCategory
        });

        if (!product) {
            res.status(404).json({ success: false, message: "Product not created" });
            return;
        }

        res.status(201).json({ success: true, message: "Product created successfully", product });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: "Internal server error" });
    }
};


export default addProduct;