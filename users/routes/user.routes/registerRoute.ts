import express from "express";
import registerUser from "../../controllers/login-signup.controllers/signup.controller/signupController";

const registerRouter = express.Router();

//for signUp
registerRouter.route("/signup").post(registerUser)

export default registerRouter