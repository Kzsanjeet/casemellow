import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";

const codOrder = async(req:Request,res:Response) =>{
    try {
        const{orderId} = req.body;
        // Fetch order details from DB & explicitly define populated type
        const order = await Order.findById(orderId).populate<{ clientId: { name: string; email: string } }>("clientId");

     if (!order) {
       res.status(404).json({ error: "Order not found" });
       return;
     }
 
     if (!order.clientId) {
       res.status(404).json({ success: false, message: "User not found" });
       return;
     }
     order.paymentMethod = "COD"
     await order.save()
     res.status(200).json({success:true, message:"COD order", data:order})
 
    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

export default codOrder;