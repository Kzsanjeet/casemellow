import { Request, Response } from "express";
import Brand from "../../models/brand.models/brand";

const addBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { brandName } = req.body;

        // Validate inputs
        // if (!brandName || !phoneModels || !Array.isArray(phoneModels)) {
        //     res.status(400).json({ success: false, message: "Please fill all required fields" });
        //     return;
        // }

        // for (const phoneModel of phoneModels) {
        //     if (!phoneModel.modelName || !Array.isArray(phoneModel.coverTypes)) {
        //         res.status(400).json({ success: false, message: "Invalid phone model data" });
        //         return;
        //     }

            // Check for duplicate phone model in the database
            // const phoneModelExists = await Brand.findOne({
            //     phoneModels: { $elemMatch: { modelName: phoneModel.modelName } },
            // });

        //     if (phoneModelExists) {
        //         res.status(400).json({
        //             success: false,
        //             message: `Phone model ${phoneModel.modelName} already exists in another brand`,
        //         });
        //         return;
        //     }
        // }

        // Check if the brand already exists
        const existingBrand = await Brand.findOne({ brandName });

        if (existingBrand) {
            res.status(400).json({ success: false, message: "Brand already exists" });
            return;
        }
            // Add new phone models to the existing brand
            // await Brand.updateOne(
            //     { _id: existingBrand._id },
            //     { $push: { phoneModels: { $each: phoneModels } } }  
                // $push:
                // Adds an item (or items) to an array.
                // If the field doesn’t exist, it creates the array and then adds the items.
                // $each:
                // Specifies that multiple items should be added to the array.
                // Without $each, MongoDB would attempt to push the entire array as a single element.

        // Create a new brand
        const newBrand = await Brand.create({ brandName});

        if (!newBrand) {
            res.status(500).json({ success: false, message: "Unable to create brand" });
            return;
        }

        res.status(201).json({ success: true, message: "Brand added successfully", brand: newBrand });
    } catch (error) {
        console.error("Error in addBrand:", error);
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

export default addBrand;
