import { Request, Response } from "express";
import Product from "../../models/product.models/productModels";

const getSpecificProduct = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {productId} = req.params;
        if(!productId){
            res.status(404).json({success:false, message:"Product ID is required"});
            return
        }
        const product = await Product.findById(productId).populate("brands","brandName");
        if(!product){
            res.status(404).json({success:false, message:"Product not found"});
            return
        }
        product.productView += 1;
        await product.save();
        res.status(200).json({success:true, message:"product fetched successfully",data:product});

    } catch (error) {
        console.log(error as Error);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}

export default getSpecificProduct;