import { Request, Response } from "express";
import Order from "../../models/order.models/order";
import CustomizeOrder from "../../models/order.models/customizeOrder";

const getTotalPending = async (req: Request, res: Response): Promise<void> => {
  try {
    const [getTotalPendingOrders, getTotalPendingCustomize] = await Promise.all([
      Order.countDocuments({ orderStatus: "pending" }),
      CustomizeOrder.countDocuments({ orderStatus: "pending" }),
    ]);

    res.status(200).json({
      success: true,
      message: "Pending data",
      data: {
        getTotalPendingOrders,
        getTotalPendingCustomize,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default getTotalPending;
