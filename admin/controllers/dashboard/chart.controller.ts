import { Request, Response } from "express";
import CustomizeOrder from "../../models/order.models/customizeOrder";
import Order from "../../models/order.models/order";
import moment from "moment";

const getTotalOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    // Last 6 months
    const months = Array.from({ length: 6 }, (_, i) =>
      moment().subtract(i, "months").startOf("month")
    ).reverse(); // Reverse to keep order: Jan -> Jun

    const data = await Promise.all(
      months.map(async (monthMoment) => {
        const start = monthMoment.toDate();
        const end = moment(monthMoment).endOf("month").toDate();

        const [normalCount, customCount] = await Promise.all([
          Order.countDocuments({
            createdAt: { $gte: start, $lte: end },
          }),
          CustomizeOrder.countDocuments({
            createdAt: { $gte: start, $lte: end },
          }),
        ]);

        return {
          month: monthMoment.format("MMMM"),
          normalOrders: normalCount,
          customizedOrders: customCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Order stats fetched",
      data,
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default getTotalOrders;
