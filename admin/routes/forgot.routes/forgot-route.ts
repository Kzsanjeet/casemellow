import express from "express";
import { passwordChange, passwordReset } from "../../controllers/signup.controller/forgot-password/forgotPassword";


const adminForgotPasswordRouter = express.Router();

adminForgotPasswordRouter.route("/admin/forgot-password").post(passwordReset)
adminForgotPasswordRouter.route("/admin/password-reset/:token").post(passwordChange)

export default adminForgotPasswordRouter