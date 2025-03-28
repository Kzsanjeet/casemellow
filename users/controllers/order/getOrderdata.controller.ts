import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";

const getUserOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id; // Get order ID from request parameters
        if (!orderId) {
            res.status(400).json({ success: false, message: "Order ID is required" });
            return;
        }

        const getOrder = await Order.findById(orderId)
            .populate("clientId cartId")
            .populate("productId.product");

        if (!getOrder) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Fetched order data", data: getOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default getUserOrder;
