import { Request, Response } from "express";
import Brand from "../../models/brand.models/brand";

const getBrandById = async(req:Request,res:Response) =>{
    try {
        const brandId = req.params.brandId;
        const getSpecificBrand = await Brand.findById(brandId);
        if(!getSpecificBrand) {
            res.status(404).json({success:false,message: "Brand not found"});
            return
        }
        res.status(200).json({success:true,data:getSpecificBrand});
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"Internal server"})
    }
}

export default getBrandById;