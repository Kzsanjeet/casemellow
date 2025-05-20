import { Request, Response } from "express";
import Client from "../../../admin/models/signup.models/client";
import bcrypt from "bcrypt";

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

const editUserData = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try {
    if (!req.user || !req.user.clientId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return
    }

    const clientId = req.user.clientId;
    const { name, email, number, oldPassword, newPassword } = req.body;

    const checkUser = await Client.findById(clientId);
    if (!checkUser) {
    res.status(404).json({ success: false, message: "User not found" });
    return
    }

    if (oldPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(oldPassword, checkUser.password);
      if (!isValidPassword) {
        res.status(401).json({ success: false, message: "Invalid old password" });
        return
      }
      // If password is valid, hash the new password
      checkUser.password = await bcrypt.hash(newPassword, 10);
    }

    // Update other fields
    checkUser.name = name || checkUser.name;
    checkUser.email = email || checkUser.email;
    checkUser.number = number || checkUser.number;

    // Save changes
    await checkUser.save();

    res.status(200).json({
      success: true,
      message: "User data updated successfully",
      data: {
        _id:checkUser._id,
        name: checkUser.name,
        email: checkUser.email,
        number: checkUser.number,
      },
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
    return
  }
};


export {getUserData,editUserData};
