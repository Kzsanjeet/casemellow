import { Request, Response } from "express";
import Product from "../../../admin/models/product.models/productModels";

const getAllProductByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1); 
    const limit = Math.max(1, parseInt(req.query.limit as string) || 30); 
    const search = (req.query.search as string || "").toLowerCase().trim();
    const category = req.params.category; 

    if (!category) {
      res.status(400).json({ success: false, message: "Category is required" });
      return
    }

    const skip = (page - 1) * limit;

    // Search query using `$or` for multiple fields
    const searchQuery = search
      ? {
          $or: [
            { productName: { $regex: search, $options: "i" } },
            { phoneModel: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Combine search and category filters
    const query = { productCategory:category, ...searchQuery };

    const products = await Product.find(query)
      .populate("brands", "brandName") 
      .sort({ createdAt: -1 }) 
      .skip(skip) 
      .limit(limit); 

    if (products.length === 0) {
      res.status(404).json({ success: false, message: "No products found" });
      return 
    }

    const totalProducts = await Product.countDocuments(query); // Count total matching documents

    res.status(200).json({
      success: true,
      data: products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export default getAllProductByCategory;
