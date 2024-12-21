import { Request, Response } from "express";
import PhoneModel from "../../models/phoneModel.models/phoneModel";

const addPhoneModel = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {phoneModel,coverType} = req.body;
        if(!phoneModel || !coverType){
             res.status(404).json({success:false, message:"Please fill all the fields"});
             return
        }
        const newPhoneModel = await PhoneModel.create({phoneModel,coverType});
        if(!newPhoneModel){
             res.status(404).json({success:false, message:"Failed to add phone model"})
             return
        }
         res.status(200).json({success:true, message:"Phone model added successfully", newPhoneModel})
         return
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:"Internal server error"})
    }
}

export default addPhoneModel