import { Request, Response } from "express";
import Cart from "../../models/cart/cart.models";

interface AuthenticatedRequest extends Request {
    user?: { clientId: string }; 
}

const addToCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const clientId = req.user.clientId; 
        const { productId, brandName, phoneModel, coverType, quantity } = req.body;

        if (!productId || !brandName || !phoneModel || !coverType || !quantity) {
            res.status(400).json({ success: false, message: "Please fill all fields" });
            return;
        }

        // Check if the product is already in the cart for the same user
        const existingCartItem = await Cart.findOne({ clientId, productId });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            existingCartItem.brandName = brandName;
            existingCartItem.phoneModel = phoneModel;
            existingCartItem.coverType = coverType;
            await existingCartItem.save();

            res.status(200).json({ success: true, message: "Cart updated", data: existingCartItem });
            return
        }

        const addCart = await Cart.create({
            clientId, 
            productId,
            brandName,
            phoneModel,
            coverType,
            quantity
        });

        if (!addCart) {
            res.status(400).json({ success: false, message: "Failed to add to cart" });
            return;
        }

        res.status(200).json({ success: true, message: "Added to cart", data: addCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default addToCart;
