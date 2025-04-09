import { Request, Response } from "express";
import { uploadFile } from "../../../utility/cloudinary";
import Customize from "../../models/customize.models/customize";

export interface MulterRequest extends Request {
  files: {
    productImage?: Express.Multer.File[]; // Product image (array to support multiple files)
    categoryImage?: Express.Multer.File[]; // Category image (array to support multiple files)
  };
}

const editCustomize = async (req: Request, res: Response): Promise<void> => {
  const MulterReq = req as MulterRequest;
  
  try {
    const {
      brands, // Expecting the brand ID
      phoneModel,
      coverTypes, // Cover types coming as a stringified JSON array
      productPrice,
    } = MulterReq.body;

    // Extract product ID from request params
    const { customizeId } = req.params;
    console.log(customizeId)
    // Find the existing product to update
    const product = await Customize.findById(customizeId);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    // Parse cover types from the stringified JSON
    // let parsedCoverTypes;
    // try {
    //   parsedCoverTypes = JSON.parse(coverTypes);
      
    //   if (!Array.isArray(parsedCoverTypes)) {
    //     res.status(400).json({ success: false, message: "Cover types must be an array" });
    //     return;
    //   }
    // } catch (error) {
    //   res.status(400).json({ success: false, message: "Invalid JSON format for cover types" });
    //   return;
    // }

    // Handle image update
    let uploadedImageUrl = product.mockUpImage; // Keep the existing image if none is uploaded
    const productImage = MulterReq.files.productImage?.[0];
    if (productImage) {
      const uploadedImage = await uploadFile(productImage.path, "customize");
      if (!uploadedImage?.secure_url) {
        res.status(500).json({ success: false, message: "Image upload failed" });
        return;
      }
      uploadedImageUrl = uploadedImage.secure_url;
    }

    // Update product with new data
    product.brands = brands;
    product.phoneModel = phoneModel;
    product.coverType = coverTypes;
    product.coverPrice = productPrice;
    product.mockUpImage = uploadedImageUrl;
    // Save the updated product
    await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export default editCustomize;
