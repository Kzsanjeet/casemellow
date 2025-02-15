import { Request, Response } from "express";
import Product from "../../models/product.models/productModels";

const deleteProduct = async(req:Request,res:Response):Promise<void> =>{
    try {
        const productId = req.params.productId
        const deleteProd = await Product.findByIdAndDelete(productId);
        if(!deleteProd){
            res.status(404).json({success:false, message:"Product not found"})
            return
        }
        res.status(200).json({success:true, message:"Product deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal Server Error",error})
        return
    }
}

export default deleteProduct;