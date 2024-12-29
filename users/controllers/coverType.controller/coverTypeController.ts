import { Request, Response } from "express";
import CoverType from "../../models/coverType.models/coverType";

const addCoverType = async(req:Request,res:Response) =>{
    try {
        const {coverType} = req.body;
        if(!coverType){
            return res.status(404).json({success:false, message:"Cover type is required"});
        }
        const parsedCoverType = coverType.json.parse(coverType)
        const coverTypeExist = await CoverType.findOne({coverType:parsedCoverType});
        if(coverTypeExist){
            return res.status(404).json({success:false, message:"Cover type already exist"});
        }
        const createCoverType = await CoverType.create({
            coverType:parsedCoverType
        });
        if(!createCoverType){
            return res.status(404).json({success:false, message:"Failed to create cover type"})
        }
        res.status(200).json({success:true,message:"Cover type created successfuly",createCoverType})
    } catch (error) {
        res.status(400).json({success:false, message:"Internal server error",error})
    }
}

export default addCoverType;