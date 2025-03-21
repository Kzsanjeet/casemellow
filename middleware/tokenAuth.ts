import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check for the token in the Authorization header or cookies
    const token =
      req.header("Authorization")?.split(" ")[1] || req.cookies.accessToken;

      // console.log("verify",token)

    // If token is not found, send a 401 Unauthorized response
    if (!token) {
      res.status(401).json({ success: false, message: "Access token is missing" });
      return
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY as string);
    
    // If the token is not valid or doesn't decode correctly, send a 401 Unauthorized response
    if (!decoded) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return
    }

    // Attach the decoded JWT payload to the request object
    req.user = decoded; // Ensure JWT payload contains `clientId` and other necessary info

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Log the error for debugging purposes (consider logging more details for internal use)
    console.error("Authentication error:", error);

    // Send a generic 401 Unauthorized response for invalid or expired tokens
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authenticate;
