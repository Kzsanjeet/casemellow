import { Request, Response } from "express";
import Brand from "../../models/brand.models/brand";

const getAllBrands = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string || "").toLowerCase();

  const skip = (page - 1) * limit;

  try {
    const query = search 
      ? { brandName: { $regex: search, $options: "i" } } // Case-insensitive search
      : {};

    const getBrands = await Brand.find(query)
      .sort({ createdAt: -1}) // Sort by creation date in descending order
      .skip(skip) // Skip the required number of documents
      .limit(limit); // Limit the number of results


    const totalBrands = await Brand.countDocuments(query);

    if (totalBrands === 0) {
      res.status(404).json({ success: false, message: "No brands found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: getBrands,
      totalBrands,
      totalPages: Math.ceil(totalBrands / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default getAllBrands;
