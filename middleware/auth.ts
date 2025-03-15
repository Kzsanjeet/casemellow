// import express, { Request, Response, NextFunction } from "express"
// import jwt from "jsonwebtoken"
// import User from "../admin/models/signup.models/register";

// interface AuthenticatedRequest extends Request{
//     user?: any;
// }

// const auth = async (
//     req:AuthenticatedRequest   ,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       // Extract the token from Authorization header or cookies
//       const token =
//         req.header("Authorization")?.split(" ")[1] || req.cookies.token
  
//       if (!token) {
//         res.status(404).json({
//           success: false,
//           message: "Unauthorized access. Token missing.",
//         })
//         return
//       }
  
//       // Verify the token
//       const decodedToken = jwt.verify(
//         token,
//         process.env.JWT_ACCESS_TOKEN_SECRET as string
//       ) as AuthenticatedRequest
  
//       // Find the admin using the decoded token's ID
//       const admin = await User.findById(decodedToken.user).exec()
  
//       if (!admin) {
//         res.status(404).json({
//           success: false,
//           message: "Unauthorized access. Admin not found.",
//         })
//         return
//       }
  
//       // Attach admin to the request object
//       req.user= admin
  
//       // Proceed to the next middleware
//       next()
//     } catch (error) {
//       console.error("Authentication error:", error)
  
//       if (error instanceof jwt.JsonWebTokenError) {
//         res.status(404).json({
//           success: false,
//           message: "Invalid token.",
//         })
//         return
//       }
  
//       if (error instanceof jwt.TokenExpiredError) {
//         res.status(404).json({
//           success: false,
//           message: "Token expired.",
//         })
//         return
//       }
  
//       res.status(404).json({
//         success: false,
//         message: "Unauthorized access. Invalid or expired token.",
//       })
//     }
//   }
  
//   export default auth
