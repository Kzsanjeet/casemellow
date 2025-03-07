import { Request, Response } from "express";
import Cart from "../../models/cart/cart.models";

const addToCart = async(req:Request,res:Response):Promise<void> =>{
    try {
        const { clientId, productId, brandName, phoneModel, coverType,quantity } = req.body;
        if(!clientId 
            ||!productId
            ||!brandName
            ||!phoneModel
            ||!coverType
            ||!quantity
        ){
            res.status(400).json({success:false, message:"Please fill all the fields"});
            return
        }
        const addCart = await Cart.create({
            clientId:clientId,
            productId:productId,
            brandName:brandName,
            phoneModel:phoneModel,
            coverType:coverType,
            quantity:quantity
        })
        if(!addCart){
            res.status(400).json({success:false, message:"Failed to add to cart"});
        }
        res.status(200).json({success:true, message:"Added to cart", data:addCart})
    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

export default addToCart