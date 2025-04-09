import { Request, Response } from "express";
import Cart from "../../models/cart/cart.models";
import Product from "../../../admin/models/product.models/productModels";

const deleteCart = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {cartId} = req.params;
        const {productId} = req.query;
        if(!cartId){
            res.status(400).json({success:false, message: "Cart ID is required"});
            return;
        }
        const updateProduct = await Product.findById(productId);
        if(!updateProduct){
            res.status(400).json({success:false, message: "Product not found"});
            return;
        }
        updateProduct.isCart = false;
        await updateProduct?.save();

        const cart = await Cart.findByIdAndDelete(cartId);
        if(!cart){
            res.status(404).json({success:false, message: "Cart not found"});
            return;
        }
        res.status(200).json({success:true, message: "Cart deleted successfully"});
    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message: error.message});
        }
    }
}

export default deleteCart;