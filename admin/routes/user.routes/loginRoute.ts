import express from "express";
import loginUser from "../../controllers/signup.controller/login.controller/loginController";


const loginRouter = express.Router();

loginRouter.route("/login").post(loginUser)

export default loginRouter