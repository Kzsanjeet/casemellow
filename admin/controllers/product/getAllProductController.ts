import { Request, Response } from "express";
import Product from "../../models/product.models/productModels";

const getAllProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1); // Ensure page is >= 1
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10); // Ensure limit is >= 1
    const search = (req.query.search as string || "").toLowerCase().trim();

    const skip = (page - 1) * limit;

    // Search query using `$or` for multiple fields
    const query = search
      ? {
          $or: [
            { productName: { $regex: search, $options: "i" } },
            { phoneModel: { $regex: search, $options: "i" } },
            // { brands: { $regex: search, $options: "i" } }, // Assuming "brands" is a string; if it's an ObjectId, adjust accordingly
          ],
        }
      : {};

    // Fetch products with pagination and populate brand details
    const getProducts = await Product.find(query)
      .populate("brands", "brandName") // Populate only the brandName from the Brand model
      .sort({ createdAt: -1 }) // Sort by creation date (most recent first)
      .skip(skip) // Skip documents for pagination
      .limit(limit); // Limit results per page

    const totalProducts = await Product.countDocuments(query); // Total number of matching documents

    if (totalProducts === 0) {
      res.status(404).json({ success: false, message: "No products found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: getProducts,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export default getAllProduct;
