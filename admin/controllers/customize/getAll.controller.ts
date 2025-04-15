import { Request, Response } from "express";
import Customize from "../../models/customize.models/customize";

const getAllCustomize = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1); // Ensure page is >= 1
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10); // Ensure limit is >= 1
    const search = (req.query.search as string || "").toLowerCase().trim();

    const skip = (page - 1) * limit;

    const sanitizedSearch = search.replace(/\s+/g, "");

    const query = search
      ? {
          $expr: {
            $regexMatch: {
              input: { $replaceAll: { input: "$phoneModel", find: " ", replacement: "" } },
              regex: sanitizedSearch,
              options: "i"
            }
          }
        }
      : {};
    

    // Fetch products with pagination and populate brand details
    const getProducts = await Customize.find(query)
      .populate("brands", "brandName") 
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit); 

    const totalProducts = await Customize.countDocuments(query); 

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

export default getAllCustomize;
