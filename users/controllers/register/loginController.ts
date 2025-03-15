import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Client from "../../../admin/models/signup.models/client";

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required" });
            return;
        }

        const user = await Client.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, message: "Invalid email or password" });
            return;
        }

        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            res.status(400).json({ success: false, message: "Invalid password" });
            return;
        }

        // Generate Access Token
        const accessToken = jwt.sign({ clientId: user._id }, process.env.ACCESS_SECRET_KEY as string, { expiresIn: "1h" });

        if (!accessToken) {
            res.status(400).json({ success: false, message: "Failed to generate access token" });
            return;
        }

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,  // Don't use HTTPS in development
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });
        
        res.json({
            success: true,
            message: "Logged in successfully",
            data: {
              _id: user._id,
              name: user.name,
              email: user.email,
              number: user.number
            }
          });
          
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default loginUser;
