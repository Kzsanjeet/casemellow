import { Request, Response } from "express";
import Product from "../../models/product.models/productModels";

const updateProductStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.productId;
        let { status } = req.query;

        // Convert status from string to boolean
        const booleanStatus = status === "true"; // Converts "true" -> true and "false" -> false

        if (status === undefined) {
            res.status(400).json({ success: false, message: "Status is required" });
            return;
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId },
            { $set: { isActive: booleanStatus } }, // Use boolean value
            { new: true }
        );

        if (!updatedProduct) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error updating product status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default updateProductStatus;
