import { Request, Response } from "express";
import Brand from "../../models/brand.models/brand";

const addBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { brandName, phoneModels } = req.body;

        if (!brandName || !phoneModels || !Array.isArray(phoneModels)) {
            res.status(400).json({ success: false, message: "Please fill all required fields" });
            return;
        }

        const checkBrand = await Brand.findOne({ brandName });
        if (checkBrand) {
            res.status(400).json({ success: false, message: "Brand already exists" });
            return;
        }

        // Check if any phone model already exists in this brand
        for (const phoneModel of phoneModels) {
            if (!phoneModel.modelName || !phoneModel.coverTypes) {
                res.status(400).json({ success: false, message: "Invalid phone model data" });
                return;
            }

            const phoneModelExists = await Brand.findOne({
                phoneModels: { $elemMatch: { modelName: phoneModel.modelName } },
            });

            if (phoneModelExists) {
                res.status(400).json({
                    success: false,
                    message: `Phone model ${phoneModel.modelName} already exists for another brand`,
                });
                return;
            }
        }

        // Create the brand
        const brand = await Brand.create({ brandName, phoneModels });

        if (!brand) {
            res.status(500).json({ success: false, message: "Unable to create brand" });
            return;
        }

        res.status(201).json({ success: true, message: "Brand added successfully", brand });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

export default addBrand;
