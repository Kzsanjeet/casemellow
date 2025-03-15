import { Request, Response } from "express";
import Client from "../../../admin/models/signup.models/client";

interface AuthenticatedRequest extends Request {
    user?: { clientId: string }; 
}

const getUserData = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
    try {
        if (!req.user || !req.user.clientId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return
        }

        const clientId: string = req.user.clientId;
        const client = await Client.findById(clientId).select("-password");

        if (!client) {
            res.status(404).json({ success: false, message: "User not found" });
            return
        }

        res.status(200).json({ 
            success: true, 
            message: "User data fetched successfully", 
            data: client 
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
        return
    }
};

export default getUserData;
