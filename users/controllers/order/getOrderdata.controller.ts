import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";

const getUserOrder = async(req:Request,res:Response):Promise<void> =>{
    try {
        const{clientId} = req.query;
        
        const getOrder = await Order.findById(clientId);
        if(!getOrder){
            res.status(404).json({success:false, message:"Order not found"});
            return
        }
        res.status(200).json({success:true, message:"fetched order data", data:getOrder})
    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

export default getUserOrder;