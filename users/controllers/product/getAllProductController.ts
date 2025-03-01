import { Request, Response } from "express";
import Product from "../../../admin/models/product.models/productModels";
import Brand from "../../../admin/models/brand.models/brand";

const getAllProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 8);
        const skip = (page - 1) * limit;
        const { search, sort, category, brand, isActive } = req.query || "".toLowerCase().trim();
  
        const query: any = {};

        // If a search term is provided, search across multiple fields
        if (search) {
            // Find brands that match the search term
            const matchingBrands = await Brand.find({
                brandName: { $regex: search as string, $options: "i" }
            });

            const brandIds = matchingBrands.map((brand:any) => brand._id);

            query.$or = [
                { productName: { $regex: search, $options: "i" } },
                { productDescription: { $regex: search, $options: "i" } },
                { productCategory: { $regex: search, $options: "i" } },
                { phoneModel: { $regex: search, $options: "i" } },
                ...(brandIds.length > 0 ? [{ brands: { $in: brandIds } }] : [])
            ];
        }

        if (category) query.productCategory = category;

        if (brand) {
            const brandDoc = await Brand.findOne({ brandName: { $regex: brand as string, $options: "i" } });
            if (brandDoc) {
                query.brands = brandDoc._id;
            } else {
                res.status(404).json({ success: false, message: "Brand not found" });
                return
            }
        }

        if (isActive !== undefined) query.isActive = isActive === "true";

        let sortOptions: any = {};
        if (sort === "priceAsc") sortOptions.productPrice = 1;
        else if (sort === "priceDesc") sortOptions.productPrice = -1;
        else if (sort === "orders") sortOptions.ordersNumber = -1;
        else if (sort === "views") sortOptions.productView = -1;

        const products = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortOptions)
            .populate("brands", "brandName");

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        if (products.length === 0) {
            res.status(404).json({ success: false, message: "No products found" });
            return;
        }

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                limit,
            },
        });
        return;
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default getAllProduct;
