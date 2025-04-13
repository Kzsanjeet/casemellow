import { Request, Response } from "express";
import Brand from "../../models/brand.models/brand";
import Customize from "../../models/customize.models/customize";



const getPhoneModelsMockup = async (req: Request, res: Response):Promise<void> => {
    try {
        const { phoneModel } = req.query;

        // Find products that match this brand's ID
        const phoneModels = await Customize.findOne({phoneModel:phoneModel});

        if (!phoneModels) {
            res.status(200).json({ success: true, message: "No phone models found", data:[]});
            return
        }

        res.status(200).json({ success: true, message: "Phone models fetched successfully", data: phoneModels });
    } catch (error) {
        console.error("Error fetching phone models:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return
    }
};

export default getPhoneModelsMockup;
