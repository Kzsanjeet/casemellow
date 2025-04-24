import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";
import Offer from "../../../admin/models/offer.models/offer";
import Product from "../../../admin/models/product.models/productModels";
import Cart from "../../models/cart/cart.models";

export interface AuthenticatedRequest extends Request {
    user?: { clientId: string }; 
}

const addOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
      const { clientId, cartId, promoCode, number, deliveryAddress, totalPrice } = req.body;

      // Validate required fields
      const missingFields = [];
      if (!cartId || cartId.length === 0) missingFields.push("cartId");
      // if (!pickUpAddress) missingFields.push("pickUpAddress");
      if (!deliveryAddress) missingFields.push("deliveryAddress");
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

      // Check for existing order with pending status
      let existingOrder = await Order.findOne({ clientId, cartId: { $in: cartId }, orderStatus: "pending" });

      if (existingOrder) {
          // Update existing order's cartId
          existingOrder.cartId.push(...cartId);
          await existingOrder.save();

          // Delete cart items
          const removeSelectedCart = await Cart.deleteMany({ _id: { $in: cartId } });
          if (removeSelectedCart.deletedCount === 0) {
              res.status(500).json({ success: false, message: "Unable to delete cart items" });
              return;
          }

          res.status(200).json({
              success: true,
              message: "Order updated successfully",
              data: existingOrder
          });
          return;
      }

      // Get product data and calculate total quantity
      const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      const products = [];
      const missingProducts = [];

      for (let item of cartItems) {
          const product = await Product.findById(item.productId);
          if (!product) {
              missingProducts.push(item.productId);
              continue;
          }
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
          const maxDiscount = totalPrice * 0.5;
          finalPrice = Math.max(totalPrice - Math.min(discountAmount, maxDiscount), 0);
      }

      // Create new order
      const createOrder = await Order.create({
          clientId,
          productId: products,
          cartId,
          // pickUpAddress,
          deliveryAddress,
          number,
          totalQuantity,
          totalPrice: finalPrice,
          orderStatus: "pending",
          paymentStatus: "pending",
      });

      if (!createOrder) {
          res.status(500).json({ success: false, message: "Unable to create order" });
          return;
      }

      // Update product order count
      for (let item of products) {
          const product = await Product.findById(item.product);
          if (product) {
              product.ordersNumber += item.quantity;
              await product.save(); // Save the updated product
          }
      }

      // Delete cart items
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


const khalti = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;

    // const order = await Order.findById(orderId).populate("clientId");
     // Fetch order details from DB & explicitly define populated type
     const order = await Order.findById(orderId).populate<{ clientId: { name: string; email: string } }>("clientId");

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (!order.clientId) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Khalti payment payload
    const khaltiConfig = {
      return_url: `${process.env.NEXT_BASE_URL}/order-success`,
      website_url: process.env.NEXT_BASE_URL,
      amount: order.totalPrice * 100, // Convert to paisa
      purchase_order_id: order._id.toString(),
      purchase_order_name: order.clientId.name ||"Casemellow Order",
      customer_info: {
        name: order.clientId.name || "Unknown Customer", // Fetch name from clientId
        email: order.clientId.email|| "customer@email.com",
        phone: order.number.toString(),
      },
    };
    



    if (!process.env.KHALTI_SECRET_KEY) {
      res.status(500).json({ success: false, message: "Khalti secret key is missing" });
      return;
    }

    const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khaltiConfig),
    });

    const khaltiResponse = await response.json();

    if (!response.ok) {
      console.error("Khalti API Error:", khaltiResponse);
      res.status(400).json({ error: "Payment initiation failed", details: khaltiResponse });
      return;
    }

    order.paymentMethod = "Khalti"
    await order.save()

    res.status(200).json({
      khaltiPaymentUrl: khaltiResponse.payment_url,
      transactionId: khaltiResponse.pidx,
    });

  } catch (error) {
    console.error("Payment API Error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  }
};


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
            { paymentStatus: "paid"},
            { new: true }
          );
      
          res.status(200).json({ message: "Payment successful", data: order });
        } catch (error) {
            if(error instanceof(Error)){
                console.error("Payment Verification Error:", error);
                res.status(500).json({ error: "Internal Server Error", details: error.message });
            }
        }
};
    
  
    export {addOrder,khalti, verifyKhalti}

           



