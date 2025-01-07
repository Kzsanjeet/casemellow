import { Request, Response } from "express";
import Product from "../../models/product.models/productModels";
import { uploadFile } from "../../../utility/cloudinary";

interface MulterRequest extends Request {
  file: Express.Multer.File;
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

    if (!productName || !brands || !productDescription || !productPrice || !productCategory) {
      res.status(400).json({ success: false, message: "Please fill all the fields" });
      return;
    }

    // Validate and parse `page` and `limit` for future use
    // const page = parseInt(req.query.page as string) || 1;
    // const limit = parseInt(req.query.limit as string) || 10;

    const productImage = MulterReq.file;
    if (!productImage) {
      res.status(400).json({ success: false, message: "Please upload a product image" });
      return;
    }
    const uploadedImage = await uploadFile(productImage.path, "products");
    if (!uploadedImage?.secure_url) {
      res.status(500).json({ success: false, message: "Image upload failed" });
      return;
    }

    const product = await Product.create({
      productName,
      brands, // Reference to the Brand ID
      productDescription,
      productPrice,
      productImage: uploadedImage.secure_url,
      productCategory,
    });

    if (!product) {
      res.status(500).json({ success: false, message: "Product not created" });
      return;
    }
    
    res.status(201).json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export default addProduct;
