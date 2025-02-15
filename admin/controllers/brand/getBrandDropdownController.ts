import { Request, Response } from "express";
import Brand from "../../models/brand.models/brand";

const getEntireBrands = async(req:Request,res:Response):Promise<void> =>{
    try {
        const getAllbrand = await Brand.find({});
        if(!getAllbrand){
            res.status(404).json({success:false, message:"No brands found"});
            return
        }
        res.status(200).json({success:true, data:getAllbrand});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

export default getEntireBrands;