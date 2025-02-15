import { Request, Response } from "express";
import Brand from "../../models/brand.models/brand";

const editBrand = async (req: Request, res: Response): Promise<void> => {
    const brandId = req.params.brandId;
    const { brandName } = req.body;

    if (!brandName) {
        res.status(400).json({
            success: false,
            message: "Brand name is required",
        });
        return;
    }

    try {
        const existingBrand = await Brand.findById(brandId);
        if (!existingBrand) {
            res.status(404).json({
                success: false,
                message: "Brand not found",
            });
            return;
        }


        // Update the brand
        const updatedBrand = await Brand.findByIdAndUpdate(
            brandId,
            { $set: { brandName } },
            {
                new: true, // Return the updated document
                runValidators: true, // Validate against schema
            }
        );

        res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            data: updatedBrand,
        });
    } catch (error) {
        console.error("Error updating brand:", error);

        if (error instanceof Error && error.name === "ValidationError") {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default editBrand;
