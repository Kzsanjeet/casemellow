import { Request, Response } from "express";
import Product from "../../models/product.models/productModels";
import Brand from "../../models/brand.models/brand";
import mongoose from "mongoose";

const deleteSpecificBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const brandId = req.params.brandId;

    // Validate the brandId
    if (!brandId || !mongoose.Types.ObjectId.isValid(brandId)) {
      res.status(400).json({ success: false, message: "Invalid or missing Brand ID" });
      return;
    }

    // Check if the brand is used in any products
    const checkBrandInProducts = await Product.find({ brands: brandId });
    if (checkBrandInProducts.length > 0) {
      res.status(400).json({ success: false, message: "Brand is used in products, cannot delete" });
      return;
    }

    // Delete the brand
    const deleteBrand = await Brand.findByIdAndDelete(brandId);
    if (!deleteBrand) {
      res.status(404).json({ success: false, message: "Brand not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default deleteSpecificBrand;
