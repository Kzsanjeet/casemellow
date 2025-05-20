import { Request, Response } from "express";
import { uploadFile } from "../../../utility/cloudinary";
import Product from "../../models/product.models/productModels";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const editSpecificProduct = async (req: Request, res: Response): Promise<void> => {
  const MulterReq = req as MulterRequest;

  try {
    const productId = req.params.productId;
    const {
      productName,
      brands, // Expecting the brand ID
      phoneModel,
      coverType,
      productDescription,
      productPrice,
      discount,
      productCategory,
    } = MulterReq.body;

   // Parse coverType
    let parsedCoverType;
    try {
      parsedCoverType = JSON.parse(coverType);
      if (!Array.isArray(parsedCoverType)) {
        res.status(400).json({ success: false, message: "coverType must be an array" });
        return;
      }
    } catch (err) {
      res.status(400).json({ success: false, message: "Invalid JSON format for coverType" });
      return;
    }

    // Check if product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    // Handle image upload
    let productImageUrl = existingProduct.productImage;
    if (MulterReq.file) {
      const uploadedImage = await uploadFile(MulterReq.file.path, "products");
      if (!uploadedImage?.secure_url) {
        res.status(500).json({ success: false, message: "Image upload failed" });
        return;
      }
      productImageUrl = uploadedImage.secure_url;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          productName,
          brands,
          phoneModel,
          coverType: parsedCoverType,
          productDescription,
          productPrice,
          discount,
          productCategory,
          productImage: productImageUrl,
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      res.status(500).json({ success: false, message: "Product update failed" });
      return;
    }

    res.status(200).json({ success: true, message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export default editSpecificProduct;
