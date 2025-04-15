import { Request, Response } from "express";
import Customize from "../../models/customize.models/customize";

const getSpecificCustomize = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {customizeId} = req.params;
        if(!customizeId){
            res.status(404).json({success:false, message:"customize ID is required"});
            return
        }
        const product = await Customize.findById(customizeId).populate("brands","brandName");
        if(!product){
            res.status(404).json({success:false, message:"Product not found"});
            return
        }
        res.status(200).json({success:true, message:"product fetched successfully",data:product});

    } catch (error) {
        console.log(error as Error);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}

export default getSpecificCustomize;