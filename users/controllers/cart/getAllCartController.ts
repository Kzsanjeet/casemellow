import { Request, Response } from "express";
import Cart from "../../models/cart/cart.models";

const getAllUserCart = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {clientId} = req.params;
        if(!clientId){
            res.status(404).json({success:false, message:"client id is required"})
            return
        }
        const userCart = await Cart.find({clientId}).populate("productId")
        if(!userCart){
            res.status(404).json({success:false, message:"cart not found"})
            return
        }
        res.status(200).json({success:false, message:"All user cart", data:userCart})
    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

export default getAllUserCart;