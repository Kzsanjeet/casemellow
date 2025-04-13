import { Request, Response } from "express";
import { uploadFile } from "../../../utility/cloudinary";
import Product from "../../models/product.models/productModels";

export interface MulterRequest extends Request {
  files: {
    productImage?: Express.Multer.File[]; // Product image (array to support multiple files)
    categoryImage?: Express.Multer.File[]; // Category image (array to support multiple files)
  };
}

const addProduct = async (req: Request, res: Response): Promise<void> => {
  const MulterReq = req as MulterRequest;

  try {
    const {
      productName,
      brands, // Expecting the brand ID
      phoneModel,
      coverTypes,
      productDescription,
      productPrice,
      productCategory,
    } = MulterReq.body;

    if (!productName || !brands || !productDescription || !productPrice || !productCategory || !phoneModel || !coverTypes) {
      res.status(400).json({ success: false, message: "Please fill all the fields" });
      return;
    }

    const productImage = MulterReq.files.productImage?.[0];
    if (!productImage) {
      res.status(400).json({ success: false, message: "Please upload a product image" });
      return;
    }
    
    const uploadedImage = await uploadFile(productImage.path, "products");
    if (!uploadedImage?.secure_url) {
      res.status(500).json({ success: false, message: "Image upload failed" });
      return;
    }

    let parsedCoverTypes;
    try {
      parsedCoverTypes = JSON.parse(coverTypes);
      
      if (!Array.isArray(parsedCoverTypes)) {
        res.status(400).json({ success: false, message: "Cover types must be an array" });
        return;
      }
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid JSON format for cover types" });
      return;
    }

    const product = await Product.create({
      productName,
      brands, // Reference to the Brand ID,
      phoneModel,
      coverType: parsedCoverTypes,
      // coverType: coverTypes,  
      productDescription,
      productPrice,
      productImage: uploadedImage.secure_url || "",
      productCategory,
    })

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
