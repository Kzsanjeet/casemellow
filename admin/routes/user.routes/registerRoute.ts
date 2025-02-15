import express from "express";
import registerUser from "../../controllers/signup.controller/register/signupController";


const registerRouter = express.Router();

//for signUp
registerRouter.route("/signup").post(registerUser)

export default registerRouter