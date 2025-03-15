import express from "express";
import loginUser from "../../controllers/register/loginController";


const loginClientRouter = express.Router();

loginClientRouter.route("/client/login").post(loginUser)

export default loginClientRouter