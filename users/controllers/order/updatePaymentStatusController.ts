import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";

const updatePaymentStatus = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {orderId} = req.params;
        if(!orderId){
            res.status(400).json({sucess:false, message:"Order ID is required"});
            return
        }
        const order = await Order.findById(orderId);
        if(!order){
            res.status(404).json({sucess:false, message:"Order not found"});
            return
        }
        order.paymentStatus = "paid"
        await order.save();
        res.status(200).json({sucess:true, message:"Payment status updated successfully"})
    } catch (error) {
        if(error instanceof(Error)){
            res.status(500).json({sucess:false, message:error.message});
            return
        }
        res.status(500).json({sucess:false, message:"Internal Server Error"})
    }
}

export default updatePaymentStatus;