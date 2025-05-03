import { Request, Response } from "express";
import Client from "../../../admin/models/signup.models/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import passwordResetMail from "../../../middleware/forgot-mail";


export const passwordReset = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
  
    if (!email) {
      res.status(404).json({ success: false, message: "Email is required" });
      return;
    }
  
    const existingUser = await Client.findOne({ email });
    if (!existingUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
  
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.ACCESS_SECRET_KEY as string,
      { expiresIn: "5m" }
    );
  
    try {
      await passwordResetMail(existingUser.email, token);
    } catch (error) {
      res.status(400).json({ success: false, message: "Failed to send email" });
      return;
    }
  
    res.status(200).json({
      success: true,
      message: "Reset password link sent to your email",
      token
    });
  };
  

export const passwordChange = async (req: Request, res: Response):Promise<void> => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) {
     res.status(404).json({ success: false, message: "Password is required" });
     return
  }

  if (!token) {
     res.status(404).json({ success: false, message: "Token is required" });
     return
  }

  let decodedToken: JwtPayload;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY as string) as JwtPayload;
  } catch (error) {
     res.status(404).json({ success: false, message: "Invalid or expired token" });
     return
  }

  const existingUser = await Client.findById(decodedToken.id);
  if (!existingUser) {
     res.status(404).json({ success: false, message: "User not found" });
     return
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  existingUser.password = hashedPassword;
  await existingUser.save();

   res.status(200).json({
    success: true,
    message: "Password changed successfully",
    data: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        number: existingUser.number
      }
  });
};
