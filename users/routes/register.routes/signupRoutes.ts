import express from "express";
import {registerUser , verifyEmail} from "../../controllers/register/signupController";



const registerClientRouter = express.Router();

//for signUp
registerClientRouter.route("/client/signup").post(registerUser)
registerClientRouter.route("/client/verify-email/:token").patch(verifyEmail)

export default registerClientRouter