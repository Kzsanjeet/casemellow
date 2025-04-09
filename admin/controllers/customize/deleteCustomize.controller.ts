import { Request, Response } from "express";
import Customize from "../../models/customize.models/customize";

const deleteCustomize = async(req:Request,res:Response):Promise<void> =>{
    try {
        const customizeId = req.params.customizeId
        const deleteProd = await Customize.findByIdAndDelete(customizeId);
        if(!deleteProd){
            res.status(404).json({success:false, message:"Product not found"})
            return
        }
        res.status(200).json({success:true, message:"Product deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal Server Error",error})
        return
    }
}

export default deleteCustomize;