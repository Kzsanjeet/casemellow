// import { Request, Response } from "express";
// import Order from "../../../admin/models/order.models/order";
// import Offer from "../../../admin/models/offer.models/offer";
// import Product from "../../../admin/models/product.models/productModels";

// const addOrder = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { clientId, productId, promoCode, brandName, phoneModel, coverType } = req.body;

//         if (!clientId || !productId || !brandName || !phoneModel || !coverType) {
//             res.status(400).json({ success: false, message: "All fields are required" });
//             return;
//         }

//         let finalTotal 

     
//         if (promoCode) {
//             const validatePromoCode = await Offer.findOne({ promoCode: promoCode });
//             if (!validatePromoCode) {
//                 res.status(400).json({ success: false, message: "Invalid promo code" });
//                 return;
//             }

//             const product = await Product.findById(productId);
//             if (!product) {
//                 res.status(404).json({ success: false, message: "Product not found" });
//                 return;
//             }

//             const discountAmount = validatePromoCode.discount || 0;
//             finalTotal = Math.max(product.productPrice - discountAmount, 0); 
//         }

//         // Create the order
//         const placeOrder = await Order.create({
//             clientId,
//             productId,
//             brandName,
//             phoneModel,
//             coverType,
//             total: finalTotal, 
//         });

//         if (!placeOrder) {
//             res.status(500).json({ success: false, message: "Unable to create order" });
//             return;
//         }

//         res.status(201).json({ success: true, message: "Order confirmed", data: placeOrder });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// export default addOrder;


import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";
import Offer from "../../../admin/models/offer.models/offer";
import Product from "../../../admin/models/product.models/productModels";
import Cart from "../../models/cart/cart.models";

interface AuthenticatedRequest extends Request {
    user?: { clientId: string }; 
}


const addOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if(!req.user?.clientId){
            res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const clientId = req.user?.clientId;  
        const {cartId, promoCode, pickUpAddress, deliveryAddress } = req.body;
    
        // Validate required fields
        if (!clientId || !cartId || !pickUpAddress || !deliveryAddress) {
            res.status(400).json({ success: false, message: "Client ID, cart ID, pickup address, and delivery address are required" });
            return
        }
    
        // Retrieve the cart items for the client
        const cartItems = await Cart.find({ clientId, _id: { $in: cartId } });
        if (cartItems.length === 0) {
            res.status(404).json({ success: false, message: "No products found in the cart" });
            return
        }
    
        // Calculate total price and quantity
        let finalTotal = 0;
        let totalQuantity = 0;
        const products = [];
    
        for (let item of cartItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
            res.status(404).json({ success: false, message: `Product with ID ${item.productId} not found` });
            return
            }
    
            finalTotal += product.productPrice * item.quantity;
            totalQuantity += item.quantity;
    
            products.push({
            product: item.productId,
            quantity: item.quantity,
            });
        }
    
        // Apply promo code if available
        if (promoCode) {
            const promo = await Offer.findOne({ promoCode });
            if (!promo) {
            res.status(400).json({ success: false, message: "Invalid promo code" });
            return
            }
    
            const discountAmount = promo.discount || 0;
            finalTotal = Math.max(finalTotal - discountAmount, 0); 
        }
    
        // Create the order
        const createOrder = await Order.create({
            clientId,
            productId: products,
            cartId,
            pickUpAddress,
            deliveryAddress,
            totalQuantity,
            totalPrice: finalTotal,
            orderStatus: "pending", 
            paymentStatus: "pending", 
        });
    
        if (!createOrder) {
            res.status(500).json({ success: false, message: "Unable to create order" });
            return
        }
    
        res.status(201).json({ success: true, message: "Order confirmed", data: createOrder });
        } catch (error) {
        console.error(error);
        if(error instanceof(Error)){
            res.status(500).json({ success: false, message: error.message });
        }
        }
    };
  
    export default addOrder

           
