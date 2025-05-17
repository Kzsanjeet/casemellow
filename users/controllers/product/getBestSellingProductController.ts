import { Request, Response } from "express";
import Product from "../../../admin/models/product.models/productModels";

const getBestSellingProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1); 
        const limit = Math.max(1, parseInt(req.query.limit as string) || 8); 
        const skip = (page - 1) * limit;

        const query = {
        ordersNumber:{
                $gte: 3
            },
        isActive:true
        }
        // Fetch only products with sells >= 1 and apply pagination
        const getBestProd = await Product.find(query) 
            .populate("brands", "brandName")
            .sort({ ordersNumber: -1 }) 
            .limit(limit)
            .skip(skip)
            .exec();

        if (!getBestProd.length) {
            res.status(404).json({ success: false, message: "No best products found" });
            return;
        }

        const totalProducts = await Product.countDocuments(query); // Total number of matching documents

        if (totalProducts === 0) {
        res.status(404).json({ success: false, message: "No products found" });
        return;
        }

        res.status(200).json({
            success: true,
            message: "Best products fetched",
            data: getBestProd,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
};

export default getBestSellingProduct;
