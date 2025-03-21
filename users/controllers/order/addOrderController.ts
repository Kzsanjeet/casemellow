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
        const { clientId, cartId, promoCode, number, pickUpAddress, deliveryAddress, paymentMethod, totalPrice } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!cartId || cartId.length === 0) missingFields.push("cartId");
        if (!pickUpAddress) missingFields.push("pickUpAddress");
        if (!deliveryAddress) missingFields.push("deliveryAddress");
        if (!paymentMethod) missingFields.push("paymentMethod");
        if (!totalPrice) missingFields.push("totalPrice");
        if (!number) missingFields.push("number");

        if (missingFields.length > 0) {
            res.status(400).json({
                success: false,
                message: "Missing required fields",
                data: missingFields
            });
            return;
        }

        // Retrieve the cart items
        const cartItems = await Cart.find({ clientId, _id: { $in: cartId } });
        if (cartItems.length === 0) {
            res.status(404).json({ success: false, message: "No products found in the cart" });
            return;
        }

        let totalQuantity = 0;
        const products = [];
        const missingProducts = [];

        for (let item of cartItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                missingProducts.push(item.productId);
                continue;
            }
            totalQuantity += item.quantity;
            products.push({
                product: item.productId,
                quantity: item.quantity,
            });
        }

        if (missingProducts.length > 0) {
            res.status(404).json({ success: false, message: `Some products not found`, data: missingProducts });
            return;
        }

        // Apply promo code
        let finalPrice = totalPrice;
        if (promoCode) {
            const promo = await Offer.findOne({ promoCode });
            if (!promo) {
                res.status(400).json({ success: false, message: "Invalid promo code" });
                return;
            }
            const discountAmount = promo.discount || 0;
            finalPrice = Math.max(totalPrice - discountAmount, 0);
        }

        // Create the order
        const createOrder = await Order.create({
            clientId,
            productId: products,
            cartId,
            pickUpAddress,
            deliveryAddress,
            number,
            paymentMethod,
            totalQuantity,
            totalPrice: finalPrice,
            orderStatus: "pending",
            paymentStatus: "pending",
        });

        if (!createOrder) {
            res.status(500).json({ success: false, message: "Unable to create order" });
            return;
        }

        const removeSelectedCart = await Cart.deleteMany({ _id: { $in: cartId } });
        if (removeSelectedCart.deletedCount === 0) {
            res.status(500).json({ success: false, message: "Unable to delete cart items" });
            return;
        }

        res.status(201).json({ success: true, message: "Order confirmed", data: createOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
};


const khalti =  async (req:Request, res:Response):Promise<void> => {
    try {
      const { orderId } = req.body;
  
      // Fetch order details from DB
      const order = await Order.findById(orderId);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return
      }
  
      // Khalti payment payload
      const khaltiConfig = {
        return_url: `${process.env.NEXT_BASE_URL}/order-success`,
        website_url: process.env.NEXT_BASE_URL,
        amount: order.totalPrice * 100, // Convert to paisa
        purchase_order_id: order._id.toString(),
        purchase_order_name: "Casemellow Order",
        customer_info: {
          name: "Customer",
          email: "customer@email.com",
          phone: order.number.toString(),
        },
      };
      console.log(process.env.KHALTI_SECRET_KEY)
      if(!process.env.KHALTI_SECRET_KEY){
        res.status(500).json({ success: false, message: "Khalti secret key"})
      }
      const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY as string}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(khaltiConfig),
      });
  
      const khaltiResponse = await response.json();
  
      if (!response.ok) {
        console.error("Khalti API Error:", khaltiResponse);
        res.status(400).json({ error: "Payment initiation failed", details: khaltiResponse });
        return
      }
  
      res.status(200).json({
        khaltiPaymentUrl: khaltiResponse.payment_url,
        transactionId: khaltiResponse.pidx,
      });
    } catch (error) {
      console.error("Payment API Error:", error);
      if(error instanceof(Error)){
        res.status(500).json({ error: "Internal Server Error", details: error.message });
      }
    }}

    const verifyKhalti = async (req:Request, res:Response):Promise<void> => {
        try {
          const { pidx, orderId } = req.body;
      
          // Verify payment with Khalti
          const verifyResponse = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
            method: "POST",
            headers: {
              Authorization: `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pidx }),
          });
      
          const verifyData = await verifyResponse.json();
      
          if (!verifyResponse.ok || verifyData.status !== "Completed") {
            res.status(400).json({ error: "Payment verification failed", details: verifyData });
            return
          }
      
          // Update order status in database
          const order = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus: "paid", orderStatus: "picked up" },
            { new: true }
          );
      
          res.status(200).json({ message: "Payment successful", order });
        } catch (error) {
            if(error instanceof(Error)){
                console.error("Payment Verification Error:", error);
                res.status(500).json({ error: "Internal Server Error", details: error.message });
            }
        }
      }
    
  
    export {addOrder,khalti, verifyKhalti}

           



