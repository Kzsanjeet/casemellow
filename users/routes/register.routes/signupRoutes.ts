import express from "express";
import registerUser from "../../controllers/register/signupController";



const registerClientRouter = express.Router();

//for signUp
registerClientRouter.route("/client/signup").post(registerUser)

export default registerClientRouter