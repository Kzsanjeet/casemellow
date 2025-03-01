import { Request, Response } from "express";
import Product from "../../../admin/models/product.models/productModels";

const getSpecificProduct = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {productId} = req.params;
        if(!productId){
            res.status(404).json({success:false, message:'Product ID is required'});
            return
        }
        const product = await Product.findById(productId);
        if(!product){
            res.status(404).json({success:false, message:'Product not found'});
        }
        res.status(200).json({success:true, message:"Product detail fetched properly",data:product});
    } catch (error) {
        console.log(error);
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message});
        }
    }
}

export default getSpecificProduct;
