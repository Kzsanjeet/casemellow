import { Request, Response } from "express";
import Product from "../../../admin/models/product.models/productModels";

const getSimilarProducts = async(req:Request, res:Response):Promise<void> =>{
            try {
                const { productId } = req.params;
                const product = await Product.findById(productId);
        
                if (!product) {
                    res.status(404).json({ success: false, message: 'Product not found' });
                    return
                }
        
                // const similarProducts = await Product.find({
                //     _id: { $ne: productId }, // Exclude the current product
                //     productCategory: product.productCategory,
                //     brands: product.brands, 
                //     phoneModel: { $in: product.phoneModel }, // Matching phone models
                //     productPrice: { $gte: product.productPrice * 0.9, $lte: product.productPrice * 1.1 }, // ±10% price range
                //     coverType: { $in: product.coverType }, // Matching cover types
                //     isActive: true, 
                // }).limit(10);


                const similarProducts = await Product.find({
                    _id: { $ne: productId }, 
                    isActive: true, 
                    $or: [
                        { productCategory: product.productCategory }, 
                        { brands: product.brands }, 
                        { phoneModel: { $in: product.phoneModel } }, 
                        { productPrice: { $gte: product.productPrice * 0.9, $lte: product.productPrice * 1.1 } }, 
                        { coverType: { $in: product.coverType } }
                    ]
                }).limit(8);
                
        
                res.status(200).json({ success: true, data: similarProducts });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Server Error' });
            }
    }

    export default getSimilarProducts;
