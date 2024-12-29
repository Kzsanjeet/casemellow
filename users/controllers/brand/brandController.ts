import { Request, Response } from "express";
import Brand from "../../models/brand.models/brand";

const addBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { brandName,coverType,phoneModel } = req.body;
        if (!brandName || !coverType) {
            res.status(404).json({ success: false, message: "Please fill all the fields" });
            return;
        }

        const checkBrand = await Brand.findOne({ brandName });
        if (checkBrand) {
            res.status(400).json({ success: false, message: "Brand already exists" });
            return;
        }

        const brand = await Brand.create({ brandName,coverType,phoneModel });
        if (!brand) {
            res.status(404).json({ success: false, message: "Unable to create brand" });
            return;
        }

        res.status(200).json({ success: true, message: "Added brand successfully", brand });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: "Internal server error" });
    }
};


export default addBrand