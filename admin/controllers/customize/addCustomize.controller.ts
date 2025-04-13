import { Request, Response } from "express";
import { uploadFile } from "../../../utility/cloudinary";
import Customize from "../../models/customize.models/customize";

export interface MulterRequest extends Request {
  files: {
    productImage?: Express.Multer.File[]; // Product image (array to support multiple files)
    categoryImage?: Express.Multer.File[]; // Category image (array to support multiple files)
  };
}

const addCustomize = async (req: Request, res: Response): Promise<void> => {
  const MulterReq = req as MulterRequest;

  try {
    const {
      brands, 
      phoneModel,
      coverType, 
      productPrice,
    } = MulterReq.body;

    // Validation
    if (!brands || !productPrice || !phoneModel || !coverType) {
      res.status(400).json({ success: false, message: "Please fill all the fields" });
      return;
    }

    const productImage = MulterReq.files.productImage?.[0];
    if (!productImage) {
      res.status(400).json({ success: false, message: "Please upload a product image" });
      return;
    }
    
    // Image upload
    const uploadedImage = await uploadFile(productImage.path, "customize");
    if (!uploadedImage?.secure_url) {
      res.status(500).json({ success: false, message: "Image upload failed" });
      return;
    }

    // Create the product
    const product = await Customize.create({
      brands, // Reference to the Brand ID
      phoneModel,
      coverType, 
      coverPrice: productPrice, 
      mockUpImage: uploadedImage.secure_url || "",
      isActive: true, 
    });

    if (!product) {
      res.status(500).json({ success: false, message: "Product not created" });
      return;
    }

    res.status(201).json({ success: true, message: "Mockup created successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export default addCustomize;