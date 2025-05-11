import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";
import CustomizeOrder from "../../../admin/models/order.models/customizeOrder";

const getOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trackOrderId } = req.body;

    if (!trackOrderId) {
      res.status(400).json({ success: false, message: "Order ID is required" });
      return;
    }

    const orderStatus = await Order.findOne({ trackOrderId }).select("orderStatus");

    if (orderStatus) {
      res.status(200).json({ success: true, message: "Order status fetched", data: orderStatus });
      return;
    }

    const customOrderStatus = await CustomizeOrder.findOne({ trackOrderId }).select("orderStatus");

    if (customOrderStatus) {
      res.status(200).json({ success: true, message: "Order status fetched", data: customOrderStatus });
    } else {
      res.status(404).json({ success: false, message: "Order not found" });
      return
    }
  } catch (error) {
    console.error("Error fetching order status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default getOrderStatus;
