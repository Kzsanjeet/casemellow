import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";
import Offer from "../../../admin/models/offer.models/offer";
import Product from "../../../admin/models/product.models/productModels";

const addOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clientId, productId, promoCode, brandName, phoneModel, coverType } = req.body;

        if (!clientId || !productId || !brandName || !phoneModel || !coverType) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }

        let finalTotal 

     
        if (promoCode) {
            const validatePromoCode = await Offer.findOne({ promoCode: promoCode });
            if (!validatePromoCode) {
                res.status(400).json({ success: false, message: "Invalid promo code" });
                return;
            }

            const product = await Product.findById(productId);
            if (!product) {
                res.status(404).json({ success: false, message: "Product not found" });
                return;
            }

            const discountAmount = validatePromoCode.discount || 0;
            finalTotal = Math.max(product.productPrice - discountAmount, 0); 
        }

        // Create the order
        const placeOrder = await Order.create({
            clientId,
            productId,
            brandName,
            phoneModel,
            coverType,
            total: finalTotal, 
        });

        if (!placeOrder) {
            res.status(500).json({ success: false, message: "Unable to create order" });
            return;
        }

        res.status(201).json({ success: true, message: "Order confirmed", data: placeOrder });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default addOrder;
