import { Request, Response } from "express";
import Brand from "../../models/brand.models/brand";

const addBrand = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {brandName} = req.body;
        if(!brandName){
             res.status(404).json({success:false, message:"Please fill all the fields"});
             return
        }
        const checkBrand = Brand.findOne({brandName});
        if(!checkBrand){
            const brand = await Brand.create({brandName});
            if(!brand){
                 res.status(404).json({success:false, message:"Unable to create brand"});
                 return
            }
            res.status(200).json({success:true, message:"Added brand successfully",brand})
           
        }else{
            res.status(404).json({success:false, message:"Brand already exists"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false, message:"Internal server error"})
    }
}

export default addBrand