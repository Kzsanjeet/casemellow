import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";

const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find()
            .populate("clientId")
            .populate("productId.product")
            .populate("cartId");

        res.status(200).json({
            success: true,
            message: "Fetched all orders successfully",
            data: orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default getAllOrders;
