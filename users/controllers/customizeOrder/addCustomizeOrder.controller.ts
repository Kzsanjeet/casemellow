import { Request, Response } from "express";
import CustomizeOrder from "../../../admin/models/order.models/customizeOrder";
import { AuthenticatedRequest } from "../order/addOrderController";
import Customize from "../../../admin/models/customize.models/customize";
import { uploadFile } from "../../../utility/cloudinary";


export interface MulterRequest extends Request {
  files: {
    croppedImage?: Express.Multer.File[]; // Product image (array to support multiple files
  };
}

const addCustomizeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const AuthenticatedReq = req as AuthenticatedRequest
        const {
            clientId,
            customizeId,
            phoneModel,
            number,
            coverType,
            pickUpAddress,
            deliveryAddress,
            totalPrice,
        } = AuthenticatedReq.body;

        const missingFields = [];
        if (!customizeId) missingFields.push("customizeId");
        if (!pickUpAddress) missingFields.push("pickUpAddress");
        if (!deliveryAddress) missingFields.push("deliveryAddress");
        if (!totalPrice) missingFields.push("totalPrice");
        if (!number) missingFields.push("number");

        if (missingFields.length > 0) {
            res.status(400).json({
                success: false,
                message: "Missing required fields",
                data: missingFields,
            });
            return;
        }

        const MulterReq = req as MulterRequest;
        const croppedImage = MulterReq.files.croppedImage?.[0];
        if (!croppedImage) {
          res.status(400).json({ success: false, message: "Please upload a product image" });
          return;
        }

        const uploadedImage = await uploadFile(croppedImage.path, "products");
            if (!uploadedImage?.secure_url) {
              res.status(500).json({ success: false, message: "Image upload failed" });
              return;
            }
        

        const customize = await Customize.findById(customizeId);
        if (!customize) {
            res.status(404).json({ success: false, message: "Customize item not found" });
            return;
        }

        let existingOrder = await CustomizeOrder.findOne({
            clientId,
            orderStatus: "pending",
            customize: customizeId,
        });

        if (
            existingOrder &&
            customize.phoneModel === phoneModel &&
            customize.coverType === coverType
        ) {
            res.status(200).json({
                success: true,
                message: "Order already exists",
                data: existingOrder,
            });
            return;
        }

        const createOrder = await CustomizeOrder.create({
            clientId,
            customize: customizeId,
            croppedImage:uploadedImage.secure_url || "",
            pickUpAddress,
            deliveryAddress,
            number,
            totalPrice,
            orderStatus: "pending",
            paymentStatus: "pending",
        });

        if (!createOrder) {
            res.status(500).json({ success: false, message: "Unable to create order" });
            return;
        }

        res.status(201).json({ success: true, message: "Order confirmed", data: createOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};


const customizekhalti = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customizeOrderId } = req.body;
  
       // Fetch order details from DB & explicitly define populated type
       const customizeOrder = await CustomizeOrder.findById(customizeOrderId).populate<{ clientId: { name: string; email: string } }>("clientId");
  
      if (!customizeOrder) {
        res.status(404).json({ error: "CustomizeOrder not found" });
        return;
      }
  
      if (!customizeOrder.clientId) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
  
      // Khalti payment payload
      const khaltiConfig = {
        return_url: `${process.env.NEXT_BASE_URL}/customize/order/success`,
        website_url: process.env.NEXT_BASE_URL,
        amount: customizeOrder.totalPrice * 100, // Convert to paisa
        purchase_order_id: customizeOrder._id.toString(),
        purchase_order_name: customizeOrder.clientId.name ||"Casemellow Order",
        customer_info: {
          name: customizeOrder.clientId.name || "Unknown Customer", // Fetch name from clientId
          email: customizeOrder.clientId.email|| "customer@email.com",
          phone: customizeOrder.number.toString(),
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
  
      customizeOrder.paymentMethod = "Khalti"
      await customizeOrder.save()
  
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
  
  
  const customizeVerifyKhalti = async (req:Request, res:Response):Promise<void> => {
    console.log(
      'test'
    )
          try {
            const { pidx, customizeOrderId } = req.body; 
            console.log(customizeOrderId , "verify")
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
        
            // // Update order status in database
            const order = await CustomizeOrder.findByIdAndUpdate(
              customizeOrderId,
              { paymentStatus: "paid"},
              { new: true }
            );
        
            res.status(200).json({ message: "Payment successful", data:order});
          } catch (error) {
              if(error instanceof(Error)){
                  console.error("Payment Verification Error:", error);
                  res.status(500).json({ error: "Internal Server Error", details: error.message });
              }
          }
  };

  const customizeCodOrder = async(req:Request,res:Response) =>{
      try {
          const{customizeOrderId} = req.body;
          // Fetch order details from DB & explicitly define populated type
          const order = await CustomizeOrder.findById(customizeOrderId).populate<{ clientId: { name: string; email: string } }>("clientId");
  
       if (!order) {
         res.status(404).json({ error: "Order not found" });
         return;
       }
   
       if (!order.clientId) {
         res.status(404).json({ success: false, message: "User not found" });
         return;
       }
       order.paymentMethod = "COD"
       order.paymentStatus = "pending"
       await order.save()
       res.status(200).json({success:true, message:"COD order", data:order})
   
      } catch (error) {
          console.log(error)
          if(error instanceof(Error)){
              res.status(500).json({success:false, message:error.message})
          }
      }
  }

  const updateCustomizePaymentStatus = async (req: Request, res: Response):Promise<void> => {
    try {
      const { customizeOrderId } = req.params;
      console.log(customizeOrderId, "update")
      const order = await CustomizeOrder.findByIdAndUpdate(
        customizeOrderId,
        { $set: { paymentStatus: "paid" } },
        { new: true }
        );
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return
      }
      res.status(200).json({ message: "Payment status updated", data: order });
    } catch (error) {
      console.error("Update Payment Status Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const getAllCustomizeOrders = async (req: Request, res: Response): Promise<void> => {
      try {
          const page = Math.max(1, parseInt(req.query.page as string) || 1);
          const limit = Math.max(1, parseInt(req.query.limit as string) || 8);
          const skip = (page - 1) * limit;
          const { search, sort ,paymentStatus } = req.query;
  
          const query: any = {};
  
          // Search by product name or client name
          if (search && typeof search === "string") {
              query.$or = [
                  { paymentStatus: { $regex: search, $options: "i" } },
                  { orderStatus: { $regex: search, $options: "i" } },
                  {paymentMethod:{$regex: search, $options: "i"}}
              ];
          }
  
          // Filter by payment status
          if (paymentStatus && typeof paymentStatus === "string") {
              query.paymentStatus = paymentStatus;
          }
  
          // Sorting logic
          let sortOptions: any = {};
          if (sort === "asc") sortOptions.orderDate = 1;
          else if (sort === "desc") sortOptions.orderDate = -1;
  
          // Fetch filtered orders with pagination
          const orders = await CustomizeOrder.find(query)
          .populate("clientId") 
          .populate("customize")
          .sort(sortOptions)
          .skip(skip)
          .limit(limit);
  
          // Get total count for pagination info
          const totalOrders = await CustomizeOrder.countDocuments(query);
  
          res.status(200).json({
              success: true,
              message: "Fetched all customize orders successfully",
              data:{ 
              orders,
              pagination: {
                  totalOrders,
                  currentPage: page,
                  totalPages: Math.ceil(totalOrders / limit),
              }},
          });
      } catch (error) {
          console.error("Error fetching orders:", error);
          res.status(500).json({ success: false, message: "Internal Server Error" });
      }
  };

  //for admin

const editCustomizePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customizeOrderId } = req.query;
    const { paymentStatus } = req.body;

    const updatedOrder = await CustomizeOrder.findByIdAndUpdate(
      customizeOrderId,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Payment status updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};


const editCustomizeOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customizeOrderId } = req.query;
      const { orderStatus } = req.body;
  
      const updatedOrder = await CustomizeOrder.findByIdAndUpdate(
        customizeOrderId,
        { orderStatus },
        { new: true, runValidators: true }
      );
  
      if (!updatedOrder) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }
  
      res.status(200).json({ success: true, message: "Payment status updated successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };


 const deleteCustomizeOrder = async(req:Request,res:Response):Promise<void> =>{
      try {
          const customizeOrderId = req.params.customizeOrderId;
  
          if (!customizeOrderId || customizeOrderId.length !== 24) {
              res.status(400).json({ success: false, message: "Invalid or missing order ID" });
              return;
          }
          
          const deleteOrder = await CustomizeOrder.findByIdAndDelete(customizeOrderId);
          if(!deleteOrder){
              res.status(404).json({success:false, message:"Order not found"})
              return
          }
          res.status(200).json({success:true, message:"Order deleted successfully"})
      } catch (error) {
          console.log(error);
          res.status(500).json({success:false, message:"Internal Server Error",error})
          return
      }
  }
  

    
export {
   addCustomizeOrder,customizekhalti, 
   customizeVerifyKhalti, 
   customizeCodOrder, deleteCustomizeOrder,
  getAllCustomizeOrders, 
   editCustomizeOrderStatus, editCustomizePaymentStatus ,
   updateCustomizePaymentStatus
}  