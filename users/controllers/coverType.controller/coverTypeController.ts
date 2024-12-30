import { Request, Response } from "express";
import CoverType from "../../models/coverType.models/coverType";

const addCoverType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { coverType } = req.body;

        if (!coverType) {
            res.status(400).json({ success: false, message: "Cover type is required" });
            return;
        }

        // let parsedCoverType: string | string[] = coverType;

        // Parse if coverType is a JSON string
        // if (typeof coverType === "string") {
        //     try {
        //         parsedCoverType = JSON.parse(coverType);
        //     } catch (error) {
        //         res.status(400).json({ success: false, message: "Invalid cover type format" });
        //         return;
        //     }
        // }

        const coverTypeExist = await CoverType.findOne({coverType});
        if (coverTypeExist) {
            res.status(400).json({ success: false, message: "Cover type already exists" });
            return;
        }

        const createCoverType = await CoverType.create({
            coverType
        });

        if (!createCoverType) {
            res.status(500).json({ success: false, message: "Failed to create cover type" });
            return;
        }

        res.status(201).json({
            success: true,
            message: "Cover type created successfully",
            createCoverType,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
};

export default addCoverType;
