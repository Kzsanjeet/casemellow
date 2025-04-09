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
      brands, // Expecting the brand ID
      phoneModel,
      coverTypes, // Cover types coming as a stringified JSON array
      productPrice,
    } = MulterReq.body;

    // Validation
    // if (!brands || !productPrice || !phoneModel || !coverTypes) {
    //   res.status(400).json({ success: false, message: "Please fill all the fields" });
    //   return;
    // }

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

    // Parse cover types from the stringified JSON
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

    // Create the product
    const product = await Customize.create({
      brands, // Reference to the Brand ID
      phoneModel,
      coverType: parsedCoverTypes,
      coverPrice: productPrice, // Assuming productPrice is the price for the cover
      mockUpImage: uploadedImage.secure_url || "",
      isActive: true, // Default to active
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
