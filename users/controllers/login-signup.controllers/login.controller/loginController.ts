import { Request, Response } from "express"
import User from "../../../models/signup.models/register";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const loginUser = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
             res.status(400).json({success:false, message:"Email and password are required"})
             return
        }
        const user = await User.findOne({email});
        if(!user){
             res.status(400).json({success:false, message:"Invalid email or password"})
             return
            }
        const checkPassword = bcrypt.compareSync(password,user.password)
        if(!checkPassword){
            res.status(400).json({success:false, message:"Invalid password"})
            return
            }
        const accessToken = jwt.sign({userId:user._id},process.env.ACCESS_SECRET_KEY as string)

        if(!accessToken){
             res.status(400).json({success:false, message:"Failed to generate access token"})
             return
        }
    
        res.cookie("accessToken",accessToken,{httpOnly:true,maxAge:24*60*60})
        
        res.json({success:true, message:"Logged in successfully",accessToken})
        return

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"Internal server error"})
    }
}

const updateAccessToken = () =>{
    
}

export default loginUser