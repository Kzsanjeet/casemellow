import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";



const deleteOrder = async(req:Request,res:Response):Promise<void> =>{
    try {
        const orderId = req.params.orderId;

        if (!orderId || orderId.length !== 24) {
            res.status(400).json({ success: false, message: "Invalid or missing order ID" });
            return;
        }
        
        const deleteOrder = await Order.findByIdAndDelete(orderId);
        if(!deleteOrder){
            res.status(404).json({success:false, message:"Order not found"})
            return
        }
        res.status(200).json({success:true, message:"Order deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal Server Error",error})
        return
    }
}

export default deleteOrder;