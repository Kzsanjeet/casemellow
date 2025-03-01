import { Request, Response } from "express";
import Product from "../../../admin/models/product.models/productModels";
import Brand from "../../../admin/models/brand.models/brand";


const getPhoneModelsByBrand = async (req: Request, res: Response):Promise<void> => {
    try {
        const { brandid } = req.query;

        // Find the brand by name
        const getBrand = await Brand.findById( brandid);
        if (!getBrand) {
            res.status(404).json({ success: false, message: "Brand not found" });
            return
        }

        // Find products that match this brand's ID
        const phoneModels = await Product.find({ brands: getBrand._id }).distinct("phoneModel");

        if (!phoneModels || phoneModels.length === 0) {
            res.status(200).json({ success: true, message: "No phone models found for this brand", data:[]});
            return
        }

        res.status(200).json({ success: true, message: "Phone models fetched successfully", data: phoneModels });
    } catch (error) {
        console.error("Error fetching phone models:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return
    }
};

export default getPhoneModelsByBrand;
