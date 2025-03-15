import { Request, Response } from "express";
import Cart from "../../models/cart/cart.models";

const getAllUserCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      res.status(400).json({ success: false, message: "Client ID is required" });
      return;
    }

    const userCart = await Cart.find({ clientId }).populate("productId");

    if (userCart.length === 0) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "All user cart details",
      data: userCart,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default getAllUserCart;
