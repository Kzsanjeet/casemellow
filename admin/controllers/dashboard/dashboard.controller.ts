import { Request, Response } from "express";
import Product from "../../models/product.models/productModels";
import Brand from "../../models/brand.models/brand";
import Order from "../../models/order.models/order";
import Customize from "../../models/customize.models/customize";
import CustomizeOrder from "../../models/order.models/customizeOrder";

const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const [products, brands, orders, customize, customizeOrders] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Brand.countDocuments({}),
      Order.countDocuments({}),
      Customize.countDocuments({}),
      CustomizeOrder.countDocuments({})
    ]);
    
    if (
      products === 0 &&
      brands === 0 &&
      orders === 0 &&
      customize === 0 &&
      customizeOrders === 0
    ) {
      res.status(200).json({ success: true, message: "No data found", data: {} });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Dashboard data",
      data: {
        products,
        brands,
        orders,
        customize,
        customizeOrders
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default getDashboard;
