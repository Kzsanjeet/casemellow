import express from "express";
import { passwordChange, passwordReset } from "../../controllers/forgot-password/forgotPassword";


const forgotPasswordRouter = express.Router();

forgotPasswordRouter.route("/client/forgot-password").post(passwordReset)
forgotPasswordRouter.route("/client/password-reset/:token").post(passwordChange)

export default forgotPasswordRouter