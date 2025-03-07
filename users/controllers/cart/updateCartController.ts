import { Request, Response } from "express";
import Cart from "../../models/cart/cart.models";

const updateCart = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {cartId} = req.params;
        const { quantity } = req.body;

        if(!cartId || !quantity){
            res.status(400).json({success:false, message: "Invalid request"});
            return
        }
        const cart = await Cart.findByIdAndUpdate(cartId,{
            $set: {quantity: quantity}
        },{
            new: true
        })
        if(!cart){
            res.status(404).json({success:false, message: "Cart not found"});
            return
        }
        res.status(200).json({success:true, message: "Cart updated successfully", data:cart})
    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message: "Internal server error", error:error})
        }
    }
}

export default updateCart;