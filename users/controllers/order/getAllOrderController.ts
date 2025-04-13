import { Request, Response } from "express";
import Order from "../../../admin/models/order.models/order";

const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 8);
        const skip = (page - 1) * limit;
        const { search, sort, category, paymentStatus } = req.query;

        const query: any = {};

        // Search by product name or client name
        if (search && typeof search === "string") {
            // query.$or = [
            //     { "productId.product.productName": { $regex: search, $options: "i" } }, 
            //     { "paymentStatus": { $regex: search, $options: "i" }},
            //     { "orderStatus": { $regex: search, $options: "i" } },
            //     { "clientId.name": { $regex: search, $options: "i" } }, 
            // ];
            query.$or = [
                { paymentStatus: { $regex: search, $options: "i" } },
                { orderStatus: { $regex: search, $options: "i" } },
                {paymentMethod:{$regex: search, $options: "i"}}
            ];
        }

        // Filter by product category
        if (category && typeof category === "string") {
            query["productId.product.productCategory"] = category;
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
        const orders = await Order.find(query)
        .populate("clientId", "name number") 
        .populate("cartId")
        .populate("productId.product", "productName productCategory productPrice productImage")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

        // Get total count for pagination info
        const totalOrders = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Fetched all orders successfully",
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

export default getAllOrders;
