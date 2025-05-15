import { Request, Response } from "express";
import Order from "../../models/order.models/order";
import CustomizeOrder from "../../models/order.models/customizeOrder";

const getRecentPendingOrders = async(req:Request,res:Response):Promise<void> =>{
    try {
        const getRecentPending = await
            Order.find({
            orderStatus: "pending",
                    }).limit(3).sort({
                        createdAt: -1
                    }).select("trackOrderId")
            // Order.countDocuments({orderStatus:"pending"})
        if(getRecentPending.length === 0){
            res.status(200).json({success:true, message:"No pending orders found", data:{}})
            return
        }
        res.status(200).json({success:true, message:"Recent pending orders", data:getRecentPending})
    } catch (error) {
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message})
        }
    }
}


const getRecentPendingCustomizeOrders = async(req:Request,res:Response):Promise<void> =>{
    try {
        const getRecentPending = await
            CustomizeOrder.find({
            orderStatus: "pending",
                    }).limit(3).sort({
                        createdAt: -1
                    })
            // CustomizeOrder.countDocuments({orderStatus:"pending"})
        if(getRecentPending.length === 0){
            res.status(200).json({success:true, message:"No pending orders found", data:{}})
            return
        }
        res.status(200).json({success:true, message:"Recent pending orders", data:getRecentPending})
    } catch (error) {
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message})
        }
    }
}
export {getRecentPendingOrders, getRecentPendingCustomizeOrders}