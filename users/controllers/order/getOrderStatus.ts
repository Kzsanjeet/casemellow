import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";

const getOrderStatus = async(req:Request, res:Response):Promise<void> => {
    try {
        const {trackOrderId} = req.body;
        if(!trackOrderId){
            res.status(404).json({success:false, message:"Order id is required"})
            return
        }
        const orderStatus = await Order.findOne({ trackOrderId }).select("orderStatus");
        if(!orderStatus){
            res.status(404).json({success:false, message:"Order status not found"});
            return
        }
        res.status(200).json({success:true, message:"Order status fetched", data:orderStatus})
    } catch (error) {
        if(error instanceof(Error)){
            res.status(400).json({success:false, message:error.message})
        }
    }
}

export default getOrderStatus;