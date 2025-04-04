import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";

const editPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.query;
    const { paymentStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Payment status updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};


const editOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.query;
      const { orderStatus } = req.body;
  
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true, runValidators: true }
      );
  
      if (!updatedOrder) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }
  
      res.status(200).json({ success: true, message: "Payment status updated successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };



export{editPaymentStatus , editOrderStatus};
