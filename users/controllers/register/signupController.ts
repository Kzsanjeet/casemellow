import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Client from "../../../admin/models/signup.models/client";


const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, number, password } = req.body;

    if (!name || !email || !number || !password) {
      res.status(400).json({ success: false, message: "Please fill in all fields" });
      return;
    }
    
    const existingUser = await Client.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "User with this email already exists" });
      return; 
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await Client.create({
      name,
      email,
      number,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      user: { name: createdUser.name, email: createdUser.email, number: createdUser.number },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export default registerUser;
