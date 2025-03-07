import { Request, Response } from "express";
import Cart from "../../models/cart/cart.models";

const deleteCart = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {cartId} = req.params;
        if(!cartId){
            res.status(400).json({success:false, message: "Cart ID is required"});
            return;
        }
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